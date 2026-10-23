export function normalizeIranPhone(input: string): string {
  const cleaned = input.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+98")) return cleaned;
  if (cleaned.startsWith("0098")) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("98") && cleaned.length === 12) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+98${cleaned.slice(1)}`;
  if (cleaned.length === 10 && cleaned.startsWith("9")) return `+98${cleaned}`;
  return cleaned;
}
