"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ImageUploader } from "@/components/image-uploader"
import { ResultViewer } from "@/components/result-viewer"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { OCRService, type OCRProgress } from "@/lib/ocr-service"

export default function Home() {
  const [extractedText, setExtractedText] = useState("")
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const processImage = async (file: File) => {
    try {
      setIsProcessing(true)
      setProgress(0)
      setExtractedText("")

      const result = await OCRService.extractText(
        file,
        ['eng', 'ben'],
        (progress: OCRProgress) => {
          setProgress(progress.progress * 100)
        }
      )

      setExtractedText(result.text)
      
      toast({
        title: "Text extracted successfully",
        description: "The image has been processed and text has been extracted.",
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error processing image",
        description: error instanceof Error ? error.message : "There was an error processing your image. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 space-y-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Extract Text from Images</h1>
            <p className="text-muted-foreground">
              Upload an image containing English or Bengali text to extract its contents.
            </p>
          </div>

          <ImageUploader onImageSelect={processImage} />

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing image...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <ResultViewer text={extractedText} />
        </div>
      </main>
    </div>
  )
}