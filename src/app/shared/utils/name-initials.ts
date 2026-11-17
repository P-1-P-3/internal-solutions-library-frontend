export function getNameInitials(name: string | null | undefined): string {
    const nameParts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
    if (nameParts.length === 0) return '';

    if (nameParts.length === 1) {
        return nameParts[0].slice(0, 2).toLocaleUpperCase();
    }

    return `${nameParts[0][0]}${nameParts.at(-1)![0]}`.toLocaleUpperCase();
}
