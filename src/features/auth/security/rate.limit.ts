const attemptsTracker = new Map<string, { count: number; timestamp: number }>();

const WINDOW_MS = 60 * 1000;
const MAX_ATTEMPTS = 3;

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = attemptsTracker.get(identifier);

  if (!record) {
    attemptsTracker.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > WINDOW_MS) {
    attemptsTracker.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count += 1;
  return true;
}
