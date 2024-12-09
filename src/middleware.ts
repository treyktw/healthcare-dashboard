// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SecurityUtils } from './security';
import { headers } from 'next/headers';
import { verifyAdminIP } from './lib/utils';


// Maintain a simple in-memory cache for rate limiting
// Note: In production, use a proper distributed cache like Redis or Upstash
const rateLimitCache = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS = 100;

export async function middleware(request: NextRequest) {
    try {
      const headerList = await headers();
        const clientIP = headerList.get('x-forwarded-for')?.split(',')[0] || '';
        
        // Check rate limiting
        const now = Date.now();
        const hashedIP = await SecurityUtils.hashData(clientIP);
        const rateLimit = rateLimitCache.get(hashedIP);
        
        if (rateLimit) {
            // Reset rate limit if duration has passed
            if (now - rateLimit.timestamp > RATE_LIMIT_DURATION) {
                rateLimitCache.set(hashedIP, { count: 1, timestamp: now });
            } else {
                // Increment request count
                rateLimit.count++;
                if (rateLimit.count > MAX_REQUESTS) {
                    return new NextResponse('Too Many Requests', { status: 429 });
                }
                rateLimitCache.set(hashedIP, rateLimit);
            }
        } else {
            rateLimitCache.set(hashedIP, { count: 1, timestamp: now });
        }

        // Check suspicious headers
        const suspiciousHeaders = [
            'x-forwarded-for',
            'forwarded',
            'x-real-ip',
            'x-originating-ip',
            'cf-connecting-ip'
        ];

        const hasConflictingHeaders = suspiciousHeaders.some(header => {
            const value = request.headers.get(header);
            return value && value !== clientIP;
        });

        if (hasConflictingHeaders) {
            // Log suspicious activity (implement your logging solution)
            return new NextResponse('Access Denied', { status: 403 });
        }

        // Apply security measures to dashboard routes
        if (request.nextUrl.pathname.startsWith('/dashboard')) {
            // Verify request authenticity
            const authToken = request.headers.get('x-auth-token');
            if (!authToken || !(await SecurityUtils.timingSafeEqual(authToken, process.env.AUTH_TOKEN!))) {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }

            // Add security headers
            const response = NextResponse.next();
            response.headers.set('X-Frame-Options', 'DENY');
            response.headers.set('X-Content-Type-Options', 'nosniff');
            response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
            response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
            response.headers.set('X-XSS-Protection', '1; mode=block');
            
            // Set strict Content Security Policy
            response.headers.set('Content-Security-Policy', [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: https:",
                "font-src 'self'",
                "connect-src 'self'",
                "frame-ancestors 'none'"
            ].join('; '));

            return response;
        }

        if (request.nextUrl.searchParams.get('admin') === 'true') {
            const forwardedFor = request.headers.get('x-forwarded-for');
            const realIP = request.headers.get('x-real-ip');
            const clientIP = forwardedFor?.split(',')[0] || realIP;
        
            const isAuthorizedIP = await verifyAdminIP(clientIP);
        
            if (!isAuthorizedIP) {
              // Redirect to home page if unauthorized IP tries to access admin
              return NextResponse.redirect(new URL('/', request.url));
            }
          }

        

        return NextResponse.next();
    } catch (error) {
        console.log('Middleware error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }

    
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/admin/:path*'
    ]
}