import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractTextFromPdf } from '../services/pdf-extractor';
import { parseNote } from '../services/note-parser';
import { saveDayData, seedDayToDb } from '../services/note-saver';
import { PUBLIC_PDF_DIR, UPLOAD_DIR } from '../project-paths';

const router = Router();

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('只支持 PDF 文件'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// POST /api/notes/extract — 上传 PDF 并提取文本
router.post('/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: '请上传 PDF 文件' });
      return;
    }

    const text = await extractTextFromPdf(req.file.path);

    res.json({
      text,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error('PDF extract error:', error);
    res.status(422).json({ error: error instanceof Error ? error.message : 'PDF 文本提取失败' });
  } finally {
    if (req.file?.path) fs.rmSync(req.file.path, { force: true });
  }
});

// POST /api/notes/parse — 解析笔记文本
router.post('/parse', async (req, res) => {
  try {
    const { text, dayNumber } = req.body;

    if (typeof text !== 'string' || !text.trim() || !Number.isInteger(dayNumber) || dayNumber < 1) {
      res.status(400).json({ error: '请提供 text 和 dayNumber' });
      return;
    }

    const dayData = await parseNote(text, dayNumber);
    res.json({ dayData });
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : '笔记解析失败' });
  }
});

// POST /api/notes/confirm — 确认并保存
router.post('/confirm', async (req, res) => {
  try {
    const { dayData, overwrite = false } = req.body;

    if (!dayData || !dayData.id) {
      res.status(400).json({ error: '请提供有效的 dayData' });
      return;
    }

    const result = saveDayData(dayData, overwrite);
    seedDayToDb(dayData);

    res.json(result);
  } catch (error: any) {
    console.error('Confirm error:', error);
    res.status(500).json({ error: error.message || '保存失败' });
  }
});

// POST /api/notes/upload-pdf — 上传 PDF 到 public/pdfs/
router.post('/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: '请上传 PDF 文件' });
      return;
    }

    const dayNumber = Number(req.body.dayNumber);
    if (!Number.isInteger(dayNumber) || dayNumber < 1) {
      res.status(400).json({ error: '请提供有效的 dayNumber' });
      return;
    }

    fs.mkdirSync(PUBLIC_PDF_DIR, { recursive: true });
    const safeName = `day${dayNumber}.pdf`;
    const targetPath = path.join(PUBLIC_PDF_DIR, safeName);

    fs.copyFileSync(req.file.path, targetPath, fs.constants.COPYFILE_EXCL);

    res.json({
      success: true,
      path: `/pdfs/${safeName}`,
    });
  } catch (error) {
    console.error('Upload PDF error:', error);
    const message = error instanceof Error && 'code' in error && error.code === 'EEXIST'
      ? '同名 PDF 已存在，请重命名后再上传'
      : 'PDF 上传失败';
    res.status(500).json({ error: message });
  } finally {
    if (req.file?.path) fs.rmSync(req.file.path, { force: true });
  }
});

export default router;
