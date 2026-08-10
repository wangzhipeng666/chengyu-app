import fs from 'fs';
import { PARSE_PROMPT_PATH } from '../project-paths';

interface ParseResult {
  id: string;
  label: string;
  date?: string;
  summary?: string;
  groups: any[];
  quizzes: any[];
}

export async function parseNote(text: string, dayNumber: number): Promise<ParseResult> {
  const prompt = fs.readFileSync(PARSE_PROMPT_PATH, 'utf-8');

  // 调用 Claude API
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8096,
      system: prompt,
      messages: [
        {
          role: 'user',
          content: `请解析以下笔记内容，生成第${dayNumber}天的数据。确保输出有效的 JSON 格式。\n\n${text}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json() as any;
  const content = data.content[0]?.text;

  if (!content) {
    throw new Error('No content in Claude API response');
  }

  // 提取 JSON（可能被 markdown 代码块包裹）
  const jsonMatch = content.match(/```json?\s*\n?([\s\S]*?)\n?```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : content;

  const parsed = JSON.parse(jsonStr) as Partial<ParseResult> & { dayLabel?: string };
  const result: ParseResult = {
    ...parsed,
    id: `day-${dayNumber}`,
    label: parsed.label || parsed.dayLabel || `第${dayNumber}天`,
    groups: parsed.groups || [],
    quizzes: parsed.quizzes || [],
  };

  if (!Array.isArray(result.groups) || !Array.isArray(result.quizzes)) {
    throw new Error('AI 返回的数据结构不完整');
  }

  return result;
}
