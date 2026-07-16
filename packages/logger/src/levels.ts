export const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

export function shouldLog(configuredLevel: number, messageLevel: number): boolean {
  return messageLevel >= configuredLevel;
}

export function getLevelPriority(levelName: string): number {
  return (LEVELS as Record<string, number>)[levelName] ?? -1;
}

export function getLevelValue(level: keyof typeof LEVELS): number {
  return LEVELS[level];
}
