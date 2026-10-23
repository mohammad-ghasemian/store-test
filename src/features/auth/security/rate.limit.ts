const g = globalThis as unknown as {
  __attempts?: Map<string, { count: number; timestamp: number }>;
};
g.__attempts = g.__attempts ?? new Map();
const attemptsTracker = g.__attempts;

const WINDOW_MS = 60 * 1000;
const MAX_ATTEMPTS = 3;

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();

  for (const [key, rec] of attemptsTracker) {
    if (now - rec.timestamp > WINDOW_MS) attemptsTracker.delete(key);
  }

  const record = attemptsTracker.get(identifier);
  if (!record) {
    attemptsTracker.set(identifier, { count: 1, timestamp: now });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) return false;

  record.count += 1;
  return true;
}
