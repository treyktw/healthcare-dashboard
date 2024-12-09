// utils/security.ts

interface EncryptedData {
  iv: string;
  encryptedData: string;
}

export class SecurityUtils {
  // Convert ArrayBuffer to base64
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
  }

  // Convert base64 to ArrayBuffer
  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
  }

  // Get encryption key from environment variable
  private static async getKey(): Promise<CryptoKey> {
      if (!process.env.ENCRYPTION_KEY) {
          throw new Error('ENCRYPTION_KEY environment variable is not set');
      }

      const encoder = new TextEncoder();
      const keyData = encoder.encode(process.env.ENCRYPTION_KEY).slice(0, 32);
      
      return await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
      );
  }

  // Encrypt sensitive data
  static async encrypt(text: string): Promise<EncryptedData> {
      try {
          const encoder = new TextEncoder();
          const data = encoder.encode(text);
          
          // Generate random IV
          const iv = crypto.getRandomValues(new Uint8Array(12));
          const key = await this.getKey();

          const encryptedData = await crypto.subtle.encrypt(
              {
                  name: 'AES-GCM',
                  iv
              },
              key,
              data
          );

          return {
              iv: this.arrayBufferToBase64(iv.buffer),
              encryptedData: this.arrayBufferToBase64(encryptedData)
          };
      } catch (error) {
          console.log('Encryption error:', error);
          throw new Error('Encryption failed');
      }
  }

  // Decrypt sensitive data
  static async decrypt(encrypted: EncryptedData): Promise<string> {
      try {
          const key = await this.getKey();
          const iv = new Uint8Array(this.base64ToArrayBuffer(encrypted.iv));
          const encryptedData = this.base64ToArrayBuffer(encrypted.encryptedData);

          const decryptedData = await crypto.subtle.decrypt(
              {
                  name: 'AES-GCM',
                  iv
              },
              key,
              encryptedData
          );

          const decoder = new TextDecoder();
          return decoder.decode(decryptedData);
      } catch (error) {
          console.log('Decryption error:', error);
          throw new Error('Decryption failed');
      }
  }

  // Hash data (for IPs, etc.)
  static async hashData(data: string): Promise<string> {
      try {
          if (!process.env.HASH_SALT) {
              throw new Error('HASH_SALT environment variable is not set');
          }

          const encoder = new TextEncoder();
          const encodedData = encoder.encode(data + process.env.HASH_SALT);
          
          const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (error) {
          console.log('Hashing error:', error);
          throw new Error('Hashing failed');
      }
  }

  // Alias for hashData for backward compatibility
  static hashIP = this.hashData;

  // Generate secure random token
  static generateSecureToken(length: number = 32): string {
      try {
          const array = new Uint8Array(length);
          crypto.getRandomValues(array);
          return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      } catch (error) {
          console.log('Token generation error:', error);
          throw new Error('Token generation failed');
      }
  }

  // Timing-safe string comparison
  static async timingSafeEqual(a: string, b: string): Promise<boolean> {
      try {
          if (a.length !== b.length) {
              return false;
          }

          const encoder = new TextEncoder();
          const aData = encoder.encode(a);
          const bData = encoder.encode(b);
          
          if (aData.length !== bData.length) {
              return false;
          }
          
          let result = 0;
          for (let i = 0; i < aData.length; i++) {
              result |= aData[i] ^ bData[i];
          }
          
          return result === 0;
      } catch (error) {
          console.log('Comparison error:', error);
          throw new Error('Comparison failed');
      }
  }
}