export type DbRow = Record<string, unknown>;

interface Option {
  label: string;
  text: string;
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === '') return fallback;
  if (typeof value !== 'string') return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function extractOptionsFromText(text: string): Option[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const matches = [...normalized.matchAll(/([A-D])[.、．]\s*([\s\S]*?)(?=\s*[A-D][.、．]\s*|$)/g)];
  const options = matches
    .map((match) => ({ label: match[1], text: match[2].trim() }))
    .filter(option => option.text);

  const groups = options.reduce<Option[][]>((result, option) => {
    if (option.label === 'A' || result.length === 0) {
      result.push([option]);
    } else {
      result[result.length - 1].push(option);
    }
    return result;
  }, []);

  const completeGroups = groups.filter(group => ['A', 'B', 'C', 'D'].every(label => group.some(option => option.label === label)));
  const selectedGroup = completeGroups[completeGroups.length - 1] || groups[groups.length - 1] || [];

  return ['A', 'B', 'C', 'D'].flatMap(label => selectedGroup.find(option => option.label === label) || []);
}

function normalizeOptions(value: unknown, question?: unknown): Option[] {
  const options = parseJson<unknown>(value, []);

  if (!Array.isArray(options)) {
    return typeof question === 'string' ? extractOptionsFromText(question) : [];
  }

  const normalizedOptions = options.flatMap((option) => {
    if (typeof option === 'string') {
      return extractOptionsFromText(option);
    }

    if (option && typeof option === 'object') {
      const row = option as Record<string, unknown>;
      if (typeof row.label === 'string' && typeof row.text === 'string') {
        const splitOptions = extractOptionsFromText(`${row.label}. ${row.text}`);
        return splitOptions.length > 1 ? splitOptions : [{ label: row.label, text: row.text }];
      }
    }

    return [];
  });

  if (normalizedOptions.length >= 4) return normalizedOptions;

  return typeof question === 'string' ? extractOptionsFromText(question) : normalizedOptions;
}

function normalizeAnalysis(value: unknown): Record<string, string> {
  const parsed = parseJson<unknown>(value, null);

  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).map(([key, text]) => [key, String(text)])
    );
  }

  if (typeof value === 'string' && value.trim()) {
    return { default: value };
  }

  return {};
}

function normalizeTips(value: unknown): string[] {
  const parsed = parseJson<unknown>(value, null);

  if (Array.isArray(parsed)) {
    return parsed.map(String).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value];
  }

  return [];
}

function normalizeExamples(value: unknown): string[] {
  const parsed = parseJson<unknown>(value, []);

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && typeof (item as Record<string, unknown>).text === 'string') {
        return (item as Record<string, string>).text;
      }
      return '';
    })
    .filter(Boolean);
}

function normalizeStructure(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const parsed = parseJson<unknown>(value, null);
  return Array.isArray(parsed) ? undefined : value;
}

export function parseIdiom(row: DbRow) {
  const examples = parseJson<string[]>(row.examples, []);
  const structureExamples = normalizeExamples(row.structure);

  return {
    ...row,
    oneLineSummary: row.one_line_summary,
    collocations: parseJson<string[]>(row.collocations, []),
    structure: normalizeStructure(row.structure),
    examples: examples.length > 0 ? examples : structureExamples,
    synonyms: parseJson<string[]>(row.synonyms, []),
  };
}

export function parseWord(row: DbRow) {
  return {
    ...row,
    oneLineSummary: row.one_line_summary,
    usageContext: row.usage_context,
    examples: parseJson<unknown[]>(row.examples, []),
    analysisAngles: parseJson<unknown[]>(row.analysis_angles, []),
    synonyms: parseJson<string[]>(row.synonyms, []),
  };
}

export function parseQuiz(row: DbRow) {
  return {
    ...row,
    options: normalizeOptions(row.options, row.question),
    analysis: normalizeAnalysis(row.analysis),
    tips: normalizeTips(row.tips),
  };
}
