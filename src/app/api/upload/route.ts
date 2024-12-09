// app/api/upload/route.ts
import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
];

const UPLOAD_CONFIG = {
  BASE_PATH: "public/uploads",
  DOCUMENT_CATEGORIES: {
    IDENTIFICATION: "identification",
    INSURANCE: "insurance",
    MEDICAL_HISTORY: "medical-history",
    DENTAL_RECORDS: "dental-records",
    OTHER: "other",
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Log incoming request data
    console.log('Received form data:', 
      Object.fromEntries(formData.entries())
    );

    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;
    const category = formData.get("category") as string || 
      UPLOAD_CONFIG.DOCUMENT_CATEGORIES.OTHER;

    // Enhanced validation with detailed errors
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "No user ID provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: "File size exceeds limit",
          details: {
            size: file.size,
            maxSize: MAX_FILE_SIZE
          }
        }, 
        { status: 400 }
      );
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: "Invalid file type",
          details: {
            type: file.type,
            allowed: ALLOWED_FILE_TYPES
          }
        }, 
        { status: 400 }
      );
    }

    try {
      // Create directory structure
      const userDir = path.join(process.cwd(), UPLOAD_CONFIG.BASE_PATH, userId);
      const categoryDir = path.join(userDir, category);
      await mkdir(categoryDir, { recursive: true });

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileExtension = path.extname(file.name);
      const uniqueFilename = `${category}_${timestamp}_${uuidv4()}${fileExtension}`;
      const filePath = path.join(categoryDir, uniqueFilename);

      // Save file
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      // Generate response paths
      const relativePath = path
        .relative(path.join(process.cwd(), "public"), filePath)
        .replace(/\\/g, "/");
      const publicUrl = `/${relativePath}`;

      return NextResponse.json({
        fileUrl: publicUrl,
        filePath: relativePath,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        category,
        uploadDate: new Date().toISOString(),
        userId,
      });
    } catch (error) {
      console.error("File system error:", error);
      return NextResponse.json(
        { error: "Failed to save file", details: error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error },
      { status: 500 }
    );
  }
}
