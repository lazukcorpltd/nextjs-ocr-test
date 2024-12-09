"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ResultViewerProps {
  text: string
}

export function ResultViewer({ text }: ResultViewerProps) {
  const { toast } = useToast()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The extracted text has been copied to your clipboard.",
    })
  }

  const downloadText = () => {
    const element = document.createElement("a")
    const file = new Blob([text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "extracted-text.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Extracted Text</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            disabled={!text}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={downloadText}
            disabled={!text}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Textarea
        value={text}
        readOnly
        className="min-h-[200px]"
        placeholder="Extracted text will appear here..."
      />
    </div>
  )
}