"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      onImageSelect(file)
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1
  })

  const clearImage = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
  }, [preview])

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary" : "border-muted-foreground/25",
          preview ? "border-none p-0" : ""
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={800}
              height={400}
              className="rounded-lg max-h-[400px] w-full object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearImage()
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-xl font-medium">Drop image here or click to upload</p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG or WebP (max. 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}