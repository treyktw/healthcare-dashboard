// // lib/fileService.ts
// import fs from 'fs/promises';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';

// export class FileService {
//   private static instance: FileService;
//   private bucketPath: string;

//   private constructor() {
//     this.bucketPath = path.join(process.cwd(), 'bucket');
//   }

//   static getInstance(): FileService {
//     if (!FileService.instance) {
//       FileService.instance = new FileService();
//     }
//     return FileService.instance;
//   }

//   async initialize(): Promise<void> {
//     try {
//       await fs.mkdir(this.bucketPath, { recursive: true });
//     } catch (error) {
//       console.log('Failed to initialize bucket directory:', error);
//       throw error;
//     }
//   }

//   async uploadFile(file: File, subfolder: string = ''): Promise<string> {
//     try {
//       const folderPath = path.join(this.bucketPath, subfolder);
//       await fs.mkdir(folderPath, { recursive: true });

//       const fileExtension = path.extname(file.name);
//       const fileName = `${uuidv4()}${fileExtension}`;
//       const filePath = path.join(folderPath, fileName);

//       const arrayBuffer = await file.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
//       await fs.writeFile(filePath, buffer);

//       return `bucket/${subfolder}/${fileName}`;
//     } catch (error) {
//       console.log('Failed to upload file:', error);
//       throw error;
//     }
//   }

//   async deleteFile(filePath: string): Promise<void> {
//     try {
//       const fullPath = path.join(process.cwd(), filePath);
//       await fs.unlink(fullPath);
//     } catch (error) {
//       console.log('Failed to delete file:', error);
//       throw error;
//     }
//   }

//   async getFileUrl(filePath: string): Promise<string> {
//     // In production, you might want to serve these through a CDN
//     // For now, we'll serve them directly
//     return `/${filePath}`;
//   }
// }

// export const fileService = FileService.getInstance();