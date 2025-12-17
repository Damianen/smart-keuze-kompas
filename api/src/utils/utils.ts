export function escapeRegExp(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function normalizeString(input: string): string {
    return input.trim().replace(/[^a-z0-9\s]/gi, '');
}
