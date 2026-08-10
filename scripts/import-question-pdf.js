#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const pdfParse = require('../server/node_modules/pdf-parse');

const ROOT = path.resolve(__dirname, '..');
const sourcePdf = process.argv[2];
const day = Number(process.argv[3]);
const overwrite = process.argv.includes('--overwrite');

if (!sourcePdf || !Number.isInteger(day) || day < 1) {
  console.error('Usage: node scripts/import-question-pdf.js <pdf-path> <day-number>');
  process.exit(1);
}

const dataPath = path.join(ROOT, 'client', 'src', 'data', `day-${day}.json`);
const targetPdf = path.join(ROOT, 'client', 'public', 'pdfs', `day${day}.pdf`);

if (!overwrite && (fs.existsSync(dataPath) || fs.existsSync(targetPdf))) {
  console.error(`day-${day} already exists; refusing to overwrite`);
  process.exit(1);
}

function clean(value) {
  return value.replace(/\f/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function countBlanks(question) {
  return Math.max(1, Math.min(4, (question.match(/_{2,}/g) || []).length || 1));
}

function parseQuestions(rawText) {
  const text = rawText.replace(/\r/g, '').replace(/\f/g, '\n');
  const starts = [...text.matchAll(/(?:^|\n)(\d+)[.．]\s*[（(]/g)];

  return starts.map((match, index) => {
    const number = Number(match[1]);
    const blockStart = match.index + (match[0].startsWith('\n') ? 1 : 0);
    const blockEnd = starts[index + 1]?.index ?? text.length;
    const block = clean(text.slice(blockStart, blockEnd));
    const options = [...block.matchAll(/(?:^|\n)\s*([A-D])[.．、]\s*([\s\S]*?)(?=\n\s*[A-D][.．、]|$)/g)]
      .map(option => ({ label: option[1], text: clean(option[2]) }));

    const firstOption = block.search(/\n\s*A[.．、]/);
    const header = firstOption >= 0 ? block.slice(0, firstOption) : block;
    const metadata = header.match(/^\d+[.．]\s*[（(](\d{4})\s*([^）)]*)[）)]/);
    const question = clean(header
      .replace(/^\d+[.．]\s*/, '')
      .replace(/^([（(]\d{4}[^）)]*[）)])\s*/, '$1 '));

    if (options.length !== 4 || options.map(option => option.label).join('') !== 'ABCD') {
      throw new Error(`Question ${number} does not contain exactly A-D options`);
    }

    return {
      id: number,
      ...(metadata ? { year: metadata[1], region: metadata[2].trim() } : {}),
      question,
      blankCount: countBlanks(question),
      options,
      answer: '',
      analysis: {},
      tips: ['答案与解析待后续笔记补充'],
    };
  });
}

async function main() {
  const buffer = fs.readFileSync(sourcePdf);
  if (buffer.subarray(0, 5).toString() !== '%PDF-') throw new Error('Input is not a valid PDF');

  let extractedText;
  try {
    extractedText = execFileSync('pdftotext', ['-layout', sourcePdf, '-'], { encoding: 'utf8' });
  } catch {
    const parsed = await pdfParse(buffer);
    extractedText = parsed.text;
  }
  const quizzes = parseQuestions(extractedText);
  const expectedIds = Array.from({ length: quizzes.length }, (_, index) => index + 1);
  if (quizzes.length === 0 || quizzes.some((quiz, index) => quiz.id !== expectedIds[index])) {
    throw new Error('Question numbering is missing or out of order');
  }

  const data = {
    id: `day-${day}`,
    label: `第${day}天`,
    date: '2026-07-20',
    summary: `已导入${quizzes.length}道练习题，答案与解析待后续笔记补充。`,
    groups: [],
    quizzes,
  };

  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.mkdirSync(path.dirname(targetPdf), { recursive: true });
  fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
  fs.copyFileSync(sourcePdf, targetPdf);
  console.log(`day-${day}: ${quizzes.length} questions imported; answers pending`);
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
