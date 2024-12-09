import { createWorker, type Worker } from 'tesseract.js';

export type Language = 'eng' | 'ben';

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface OCRResult {
  text: string;
}

export class OCRService {
  private static validateFile(file: File): void {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    }

    if (file.size > maxSize) {
      throw new Error('File is too large. Maximum size is 10MB.');
    }
  }

  private static async initializeWorker(languages: Language[]): Promise<Worker> {
    const worker = await createWorker();
    const langs = languages.join('+');
    await worker.loadLanguage(langs);
    await worker.initialize(langs);
    return worker;
  }

  static async extractText(
    file: File,
    languages: Language | Language[] = ['eng'],
    onProgress?: (progress: OCRProgress) => void
  ): Promise<OCRResult> {
    try {
      this.validateFile(file);

      const langs = Array.isArray(languages) ? languages : [languages];
      const worker = await this.initializeWorker(langs);

      // Set up progress monitoring
      if (onProgress) {
        worker.setProgressHandler((progress: any) => {
          if (progress.status === "recognizing text") {
            onProgress({
              status: progress.status,
              progress: progress.progress
            });
          }
        });
      }

      const result = await worker.recognize(file);
      await worker.terminate();

      return {
        text: result.data.text
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`OCR Processing failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during OCR processing');
    }
  }
}