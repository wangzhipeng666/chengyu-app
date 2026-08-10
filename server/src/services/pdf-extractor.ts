import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  if (buffer.subarray(0, 5).toString() !== '%PDF-') {
    throw new Error('文件内容不是有效的 PDF');
  }

  const data = await pdfParse(buffer);
  const text = data.text.replace(/\u0000/g, '').trim();
  if (!text) {
    throw new Error('PDF 中没有可提取的文字，可能需要先进行 OCR');
  }

  return text;
}
