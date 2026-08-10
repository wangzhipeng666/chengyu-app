#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const sourcePdf = process.argv[2];
const day = Number(process.argv[3]);
const overwrite = process.argv.includes('--overwrite');

const CONFIG = {
  31: {
    date: '2026-07-20',
    answers: 'CDBACBACCCADCBD',
    groups: [
      ['畏首畏尾、谨小慎微、首鼠两端、如履薄冰、举步维艰', ['畏首畏尾', '谨小慎微', '首鼠两端', '如履薄冰', '举步维艰']],
      ['耳濡目染、潜移默化、春风化雨、润物无声、和风细雨', ['耳濡目染', '潜移默化', '春风化雨', '润物无声', '和风细雨']],
      ['开源节流、量入为出、精打细算、细水长流、节衣缩食', ['开源节流', '量入为出', '精打细算', '细水长流', '节衣缩食']],
      ['耳熟能详、脍炙人口、喜闻乐见、交口称赞、家喻户晓', ['耳熟能详', '脍炙人口', '喜闻乐见', '交口称赞', '家喻户晓']],
    ],
  },
  32: {
    date: '2026-07-21',
    answers: 'ACABBDDDBADDCBB',
    groups: [
      ['大浪淘沙、披沙拣金、精挑细选、优胜劣汰、弱肉强食', ['大浪淘沙', '披沙拣金', '精挑细选', '优胜劣汰', '弱肉强食']],
      ['力不从心、力有不逮、无能为力、黔驴技穷、独木难支', ['力不从心', '力有不逮', '无能为力', '黔驴技穷', '独木难支']],
      ['海纳百川、兼收并蓄、博采众长、虚怀若谷、闻过则喜', ['海纳百川', '兼收并蓄', '博采众长', '虚怀若谷', '闻过则喜']],
      ['杂乱无章、错综复杂、盘根错节、千头万绪、千丝万缕', ['杂乱无章', '错综复杂', '盘根错节', '千头万绪', '千丝万缕']],
    ],
  },
  33: {
    date: '2026-07-21',
    answers: 'CBCABAADDCCBBDB',
    quizGroups: [4, 7, 11, 15],
    type: 'words',
    groups: [
      ['引领、引导、指引、指导、指点、指示', ['引领', '引导', '指引', '指导', '指点', '指示']],
      ['制定、制订、拟定、拟订、缔结', ['制定', '制订', '拟定', '拟订', '缔结']],
      ['保障、保证、保护、维护、支撑', ['保障', '保证', '保护', '维护', '支撑']],
      ['漠视、忽视、无视、轻视、蔑视', ['漠视', '忽视', '无视', '轻视', '蔑视']],
    ],
  },
  34: {
    date: '2026-07-23',
    answers: 'CCBADDDDDAABDCDB',
    quizGroups: [4, 7, 12, 16],
    groups: [
      {
        name: '借鉴、借镜、学习、效仿、沿袭、复刻、照搬',
        type: 'words',
        entries: [
          ['借鉴', '用镜子照看。比喻参考他人的经验或教训来对照改进自己。'],
          ['借镜', '照他人经验以改进自身。'],
          ['学习', '通过阅读、实践等方式获取知识或技能。'],
          ['效仿', '模仿别人的做法，照着去做。'],
          ['沿袭', '照旧有的传统、制度或做法，继续照做下去，不加改变。'],
          ['复刻', '依照原样重新制作一份，力求一模一样。'],
          ['照搬', '原封不动地搬用别人的经验、方法或理论，不加任何改变。'],
        ],
      },
      {
        name: '弱化、退化、淡化、削弱',
        type: 'words',
        entries: [
          ['弱化', '使力量或程度减弱。'],
          ['退化', '指器官、机能、能力、素质或水平等由复杂到简单、由强到弱、由好变差。'],
          ['淡化', '指浓度、颜色、味道，或情感、印象、记忆、观念、矛盾、界限等由浓转淡、由重转轻。'],
          ['削弱', '力量、势力减弱；使变弱，侧重由于外力介入导致力量变弱。'],
        ],
      },
      {
        name: '狗尾续貂、东施效颦、照猫画虎、随波逐流、拾人牙慧',
        type: 'idioms',
        entries: [
          ['狗尾续貂', '好的开头后面接了差得多的续作或后继部分，前后质量悬殊。'],
          ['东施效颦', '盲目模仿别人，尤其模仿外在姿态或样子，结果适得其反。'],
          ['照猫画虎', '只学表面皮毛，依样画葫芦，不得精髓。'],
          ['随波逐流', '没有主见，顺应大流、盲目跟风。'],
          ['拾人牙慧', '捡取别人说过的话、观点、见解当作自己的，缺乏原创。'],
        ],
      },
      {
        name: '一以贯之、亘古不变、一成不变、始终如一、一气呵成',
        type: 'idioms',
        entries: [
          ['一以贯之', '用一个原则、精神或做法贯穿始终，侧重长期坚持不改。'],
          ['亘古不变', '从远古到现在从未改变，强调时间跨度极长、恒定。'],
          ['一成不变', '一经形成就固定不变，强调固定僵化、不知变通。'],
          ['始终如一', '从开始到结束都一样，没有变化。'],
          ['一气呵成', '一口气完成、不间断，也形容文章气势连贯。'],
        ],
      },
    ],
  },
};

function clean(value) {
  return value
    .replace(/\f/g, '\n')
    .replace(/\n\s*\d{1,2}\s*\n/g, '\n')
    .replace(/\s*\n\s*/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function extractTerm(text, name, nextNames) {
  const heading = new RegExp(`\\n\\f?[ \\t]{2}${name}[ \\t]*\\n[\\s\\f\\d]{0,100}?释义：`);
  const startMatch = heading.exec(text);
  if (!startMatch) throw new Error(`Cannot find term heading: ${name}`);
  const start = startMatch.index;
  const possibleEnds = nextNames
    .map(nextName => {
      const match = new RegExp(`\\n\\f?[ \\t]{2}${nextName}[ \\t]*\\n[\\s\\f\\d]{0,100}?释义：`).exec(text.slice(start + 1));
      return match ? start + 1 + match.index : Number.POSITIVE_INFINITY;
    });
  const questionStart = /\n\s*\d+[.．]\s*[（(]\d{4}/.exec(text.slice(start + 1));
  if (questionStart) possibleEnds.push(start + 1 + questionStart.index);
  const block = text.slice(start, Math.min(...possibleEnds));
  const meaning = clean(block.match(/释义：([\s\S]*?)(?=\n\s*(?:侧重点|用法注意|考试重点|官媒例句))/)?.[1] || '');
  const focus = clean(block.match(/侧重点：([\s\S]*?)(?=\n\s*(?:用法注意|考试重点|官媒例句))/)?.[1] || '');
  const usage = clean(block.slice(
    block.search(/(?:侧重点|用法注意|考试重点)[：:]?/),
    block.search(/\n\s*官媒例句/)
  ));
  const examplesText = block.match(/\n\s*官媒例句\s*([\s\S]*?)(?=\n\s*【注意】)/)?.[1] || '';
  const examples = clean(examplesText)
    .split(/(?=(?:人民网|新华网|光明网|人民日报|经济日报|央视新闻|求是网|环球时报|中国纪检监察报)[：:])/)
    .map(clean)
    .filter(value => value && !/^\d{1,2}$/.test(value));

  if (!meaning) throw new Error(`Cannot extract meaning for ${name}`);
  return {
    id: `day-${day}-${name}`,
    name,
    meaning,
    usage: usage || focus || meaning,
    collocations: [],
    examples,
    oneLineSummary: focus || meaning,
  };
}

function extractWord(text, name, nextNames) {
  const heading = new RegExp(`\\n\\f?[ \\t]{2}${name}[ \\t]*\\n[\\s\\f\\d]{0,100}?释义：`);
  const startMatch = heading.exec(text);
  if (!startMatch) throw new Error(`Cannot find word heading: ${name}`);
  const start = startMatch.index;
  const possibleEnds = nextNames.map(nextName => {
    const match = new RegExp(`\\n\\f?[ \\t]{2}${nextName}[ \\t]*\\n[\\s\\f\\d]{0,100}?释义：`).exec(text.slice(start + 1));
    return match ? start + 1 + match.index : Number.POSITIVE_INFINITY;
  });
  const questionStart = /\n\s*\d+[.．]\s*[（(]\d{4}/.exec(text.slice(start + 1));
  if (questionStart) possibleEnds.push(start + 1 + questionStart.index);
  const block = text.slice(start, Math.min(...possibleEnds));
  const meaning = clean(block.match(/释义：([\s\S]*?)(?=\n\s*(?:侧重点|用法注意|例句|【注意】))/)?.[1] || '');
  const focus = clean(block.match(/侧重点：([\s\S]*?)(?=\n\s*(?:用法注意|例句|【注意】))/)?.[1] || '');
  const usageContext = clean(block.match(/(?:侧重点|用法注意)[：:]?([\s\S]*?)(?=\n\s*(?:例句|【注意】))/)?.[0] || '');
  if (!meaning) throw new Error(`Cannot extract meaning for word ${name}`);
  return {
    id: `day-${day}-${name}`,
    name,
    meaning,
    usageContext: usageContext || focus || meaning,
    examples: [],
    analysisAngles: focus ? [{ dimension: '语境侧重', description: focus }] : [],
    synonyms: [],
    oneLineSummary: focus || meaning,
  };
}

function extractQuizzes(text, config) {
  const { answers } = config;
  const quizCount = answers.length;
  const starts = [...text.matchAll(/(?:^|\n)\s*(\d+)[.．]\s*[（(](\d{4})\s*([^）)]*)[）)]/g)]
    .filter(match => Number(match[1]) >= 1 && Number(match[1]) <= quizCount);
  const firstByNumber = new Map();
  for (const match of starts) {
    const number = Number(match[1]);
    if (!firstByNumber.has(number)) firstByNumber.set(number, match);
  }

  return Array.from({ length: quizCount }, (_, index) => {
    const number = index + 1;
    const match = firstByNumber.get(number);
    if (!match) throw new Error(`Cannot find question ${number}`);
    const start = match.index + (match[0].startsWith('\n') ? 1 : 0);
    const analysisMarker = new RegExp(`【解析】\\s*${number}[.．]`).exec(text.slice(start));
    if (!analysisMarker) throw new Error(`Cannot find analysis ${number}`);
    const analysisStart = start + analysisMarker.index;
    const questionBlock = text.slice(start, analysisStart);
    const optionMatches = [...questionBlock.matchAll(/(?:^|\s)([A-D])[.．]\s*/g)];
    if (optionMatches.length !== 4 || optionMatches.map(item => item[1]).join('') !== 'ABCD') {
      throw new Error(`Question ${number} does not contain exactly A-D options`);
    }
    const options = optionMatches.map((option, optionIndex) => {
      const valueStart = option.index + option[0].length;
      const valueEnd = optionMatches[optionIndex + 1]?.index ?? questionBlock.length;
      return { label: option[1], text: clean(questionBlock.slice(valueStart, valueEnd)) };
    });
    const questionEnd = optionMatches[0].index;
    const question = clean(questionBlock.slice(0, questionEnd)
      .replace(/^\s*\d+[.．]\s*/, ''));
    const rawA = questionBlock.slice(
      optionMatches[0].index + optionMatches[0][0].length,
      optionMatches[1].index
    );
    const blankCount = Math.max(1, rawA.trim().split(/[ \t]{2,}/).filter(Boolean).length);
    const afterAnalysis = text.slice(analysisStart);
    const selection = new RegExp(`【\\s*选\\s*${answers[index]}】`).exec(afterAnalysis);
    if (!selection) throw new Error(`Answer marker mismatch for question ${number}`);
    const analysisEnd = analysisStart + selection.index + selection[0].length;
    const analysis = clean(text.slice(analysisStart, analysisEnd)
      .replace(new RegExp(`^【解析】\\s*${number}[.．]?`), ''));

    return {
      id: number,
      year: match[2],
      region: match[3].trim(),
      groupId: `day-${day}-group-${config.quizGroups
        ? config.quizGroups.findIndex(lastQuestion => number <= lastQuestion) + 1
        : Math.ceil(number / 4)}`,
      question,
      blankCount,
      options,
      answer: answers[index],
      analysis: { blank1: analysis },
      tips: [],
    };
  });
}

function main() {
  const config = CONFIG[day];
  if (!sourcePdf || !config) {
    console.error('Usage: node scripts/import-annotated-note-pdf.js <pdf-path> <31|32|33|34> [--overwrite]');
    process.exit(1);
  }
  const dataPath = path.join(ROOT, 'client', 'src', 'data', `day-${day}.json`);
  const targetPdf = path.join(ROOT, 'client', 'public', 'pdfs', `day${day}.pdf`);
  if (!overwrite && (fs.existsSync(dataPath) || fs.existsSync(targetPdf))) {
    throw new Error(`day-${day} already exists; refusing to overwrite`);
  }
  const buffer = fs.readFileSync(sourcePdf);
  if (buffer.subarray(0, 5).toString() !== '%PDF-') throw new Error('Input is not a valid PDF');
  const text = execFileSync('pdftotext', ['-layout', sourcePdf, '-'], { encoding: 'utf8' })
    .replace(/\r/g, '');
  const isStatic = !Array.isArray(config.groups[0]);
  const allTerms = isStatic
    ? config.groups.flatMap(group => group.entries.map(([name]) => name))
    : config.groups.flatMap(([, terms]) => terms);
  const groups = isStatic
    ? config.groups.map((group, groupIndex) => ({
      id: `day-${day}-group-${groupIndex + 1}`,
      name: group.name,
      summary: `辨析${group.name}，重点掌握词义侧重和适用语境。`,
      [group.type]: group.entries.map(([name, meaning]) => group.type === 'words'
        ? {
          id: `day-${day}-${name}`, name, meaning, usageContext: meaning,
          examples: [], analysisAngles: [], synonyms: [], oneLineSummary: meaning,
        }
        : {
          id: `day-${day}-${name}`, name, meaning, usage: meaning,
          collocations: [], examples: [], oneLineSummary: meaning,
        }),
    }))
    : config.groups.map(([name, terms], groupIndex) => ({
      id: `day-${day}-group-${groupIndex + 1}`,
      name,
      summary: `辨析${name}，重点掌握词义侧重和适用语境。`,
      [config.type || 'idioms']: terms.map(term => config.type === 'words'
        ? extractWord(text, term, allTerms.filter(item => item !== term))
        : extractTerm(text, term, allTerms.filter(item => item !== term))),
    }));
  const quizzes = extractQuizzes(text, config);
  const data = {
    id: `day-${day}`,
    label: `第${day}天`,
    date: config.date,
    summary: `词语辨析：共${allTerms.length}个词条，${quizzes.length}道练习题。`,
    groups,
    quizzes,
  };

  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.mkdirSync(path.dirname(targetPdf), { recursive: true });
  fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
  fs.copyFileSync(sourcePdf, targetPdf);
  console.log(`day-${day}: ${allTerms.length} entries and ${quizzes.length} quizzes imported`);
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
