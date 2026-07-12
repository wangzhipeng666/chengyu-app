declare module "pdf-parse" { function pdfParse(data: Buffer): Promise<{ text: string; numpages: number; numrender: number; info: any; metadata: any; version: string }>; export default pdfParse; }
