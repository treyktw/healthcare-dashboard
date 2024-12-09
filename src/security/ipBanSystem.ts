// utils/ipBanSystem.ts
import { Redis } from '@upstash/redis';
import { SecurityUtils } from '.';

// Initialize Redis client
const redis = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!
});

interface SuspiciousActivity {
    timestamp: string;
    activity: string;
    encryptedIP: EncryptedData;
}

interface EncryptedData {
    iv: string;
    encryptedData: string;
}

export class IPBanSystem {
    private static readonly BAN_DURATION = 24 * 60 * 60; // 24 hours in seconds
    private static readonly MAX_FAILED_ATTEMPTS = 5;
    private static readonly ATTEMPT_WINDOW = 15 * 60; // 15 minutes in seconds

    // Check if an IP is banned
    static async isBanned(ip: string): Promise<boolean> {
        try {
            const hashedIP = await SecurityUtils.hashData(ip);
            const banStatus = await redis.get(`banned:${hashedIP}`);
            return !!banStatus;
        } catch (error) {
            console.log('Error checking ban status:', error);
            // Default to banned in case of error for security
            return true;
        }
    }

    // Record a failed attempt
    static async recordFailedAttempt(ip: string): Promise<void> {
        try {
            const hashedIP = await SecurityUtils.hashData(ip);
            const key = `failed_attempts:${hashedIP}`;
            
            // Add attempt with expiration
            await redis.incr(key);
            await redis.expire(key, this.ATTEMPT_WINDOW);

            // Check if should ban
            const attempts = await redis.get(key) as number;
            if (attempts >= this.MAX_FAILED_ATTEMPTS) {
                await this.banIP(ip);
            }
        } catch (error) {
            console.log('Error recording failed attempt:', error);
            // Ban IP in case of error for security
            await this.banIP(ip);
        }
    }

    // Ban an IP
    static async banIP(ip: string): Promise<void> {
        try {
            const hashedIP = await SecurityUtils.hashData(ip);
            await redis.setex(`banned:${hashedIP}`, this.BAN_DURATION, 'true');
            
            // Log the ban with encrypted IP
            const encryptedIP = await SecurityUtils.encrypt(ip);
            await this.logBanEvent(hashedIP, encryptedIP);
        } catch (error) {
            console.log('Error banning IP:', error);
        }
    }

    // Clear a ban (for admin use)
    static async clearBan(ip: string): Promise<void> {
        try {
            const hashedIP = await SecurityUtils.hashData(ip);
            await redis.del(`banned:${hashedIP}`);
            await redis.del(`failed_attempts:${hashedIP}`);
        } catch (error) {
            console.log('Error clearing ban:', error);
            throw new Error('Failed to clear ban');
        }
    }

    // Record suspicious activity
    static async recordSuspiciousActivity(ip: string, activity: string): Promise<void> {
        try {
            const hashedIP = await SecurityUtils.hashData(ip);
            const encryptedIP = await SecurityUtils.encrypt(ip);
            const timestamp = new Date().toISOString();
            
            const suspiciousActivity: SuspiciousActivity = {
                timestamp,
                activity,
                encryptedIP
            };
            
            await redis.lpush(
                `suspicious:${hashedIP}`, 
                JSON.stringify(suspiciousActivity)
            );
            
            // Keep only last 10 suspicious activities per IP
            await redis.ltrim(`suspicious:${hashedIP}`, 0, 9);
        } catch (error) {
            console.log('Error recording suspicious activity:', error);
        }
    }

    // Private method to log ban events
    private static async logBanEvent(hashedIP: string, encryptedIP: EncryptedData): Promise<void> {
        try {
            const banEvent = {
                timestamp: new Date().toISOString(),
                hashedIP,
                encryptedIP,
                type: 'IP_BAN'
            };

            await redis.lpush('ban_events', JSON.stringify(banEvent));
            await redis.ltrim('ban_events', 0, 999); // Keep last 1000 ban events
        } catch (error) {
            console.log('Error logging ban event:', error);
        }
    }

    // Get ban statistics (for admin use)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async getBanStats(): Promise<any> {
        try {
            const banEvents = await redis.lrange('ban_events', 0, -1);
            return {
                totalBans: banEvents.length,
                recentBans: banEvents.slice(0, 10).map(event => JSON.parse(event)),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.log('Error getting ban stats:', error);
            return null;
        }
    }
}