import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractTextFromPdf } from '../services/pdf-extractor';
import { parseNote } from '../services/note-parser';
import { saveDayData, seedDayToDb } from '../services/note-saver';

const router = Router();

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
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

    // 清理临时文件
    fs.unlinkSync(req.file.path);

    res.json({
      text,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error('PDF extract error:', error);
    res.status(500).json({ error: 'PDF 文本提取失败' });
  }
});

// POST /api/notes/parse — 解析笔记文本
router.post('/parse', async (req, res) => {
  try {
    const { text, dayNumber } = req.body;

    if (!text || !dayNumber) {
      res.status(400).json({ error: '请提供 text 和 dayNumber' });
      return;
    }

    const dayData = await parseNote(text, dayNumber);
    res.json({ dayData });
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: '笔记解析失败' });
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

    const targetDir = path.join(__dirname, '../../client/public/pdfs');
    const targetPath = path.join(targetDir, req.file.originalname);

    fs.copyFileSync(req.file.path, targetPath);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      path: `/pdfs/${req.file.originalname}`,
    });
  } catch (error) {
    console.error('Upload PDF error:', error);
    res.status(500).json({ error: 'PDF 上传失败' });
  }
});

export default router;
