export function escapeRegExp(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function normalizeString(input: string): string {
    return input.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().replace(/[^\p{L}\p{N}\s]/gu, '');
}

export function sanitizeInput(input: string): string {
    return decodeURIComponent(input).normalize('NFKC').replace(/[<>$;]/g, '').trim().replace(/\s+/g, ' ');
}
