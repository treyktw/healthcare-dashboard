// components/FileUploader.tsx
"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FileUploaderProps = {
  files: File[];
  onChange: (files: File[]) => void;
  onUrlChange?: (url: string) => void;
  maxSize?: number; // in bytes
  acceptedFileTypes?: Record<string, string[]>;
  userId: string;
  category: string;
};

export const FileUploader = ({
  files,
  onChange,
  onUrlChange,
  userId,
  category,
  maxSize = 5000000, // 5MB default
  acceptedFileTypes = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/pdf": [".pdf"],
  },
}: FileUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('category', category);

      // Log formData contents
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      setError(null);

      const file = acceptedFiles[0];
      console.log('Uploading file:', file.name, file.type, file.size);

      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      }

      const fileUrl = await uploadFile(file);
      onChange(acceptedFiles);
      onUrlChange?.(fileUrl);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [onChange, onUrlChange]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    maxSize,
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (rejection.errors[0].code === "file-too-large") {
        setError(`File is too large. Maximum size is ${maxSize / 1000000}MB`);
      } else {
        setError("Invalid file type. Please upload a valid file.");
      }
    },
  });

  // const clearError = () => setError(null);

  return (
    <div className="w-full space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 transition-all
          ${
            isDragActive
              ? "border-green-500 bg-green-50/10"
              : "border-gray-300 hover:border-gray-400"
          }
          ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <input {...getInputProps()} />

        {preview ||
        (files && files.length > 0 && files[0].type.startsWith("image/")) ? (
          <div className="relative aspect-video w-full">
            <Image
              src={preview || URL.createObjectURL(files[0])}
              alt="uploaded file"
              fill
              className="rounded-lg object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-sm truncate">
              {files[0]?.name}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/assets/icons/upload.svg"
              width={40}
              height={40}
              alt="upload"
              className={isDragActive ? "animate-bounce" : ""}
            />

            <div className="text-center">
              <p className="text-base font-medium">
                <span className="text-green-500">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, GIF or PDF (max. {maxSize / 1000000}MB)
              </p>
            </div>
          </div>
        )}

        {files.length > 0 && !files[0].type.startsWith("image/") && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 truncate">
              Uploaded: {files[0].name}
            </p>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          <span className="text-sm text-gray-500">Uploading...</span>
        </div>
      )}
    </div>
  );
};
