export function escapeRegExp(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function normalizeString(input: string): string {
    return input.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().replace(/[^\p{L}\p{N}\s]/gu, '');
}
