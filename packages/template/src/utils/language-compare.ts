export function languageCompare(language1: string, language2: string) {
    return language1.toLocaleLowerCase().replace(/_/g, '-') === language2.toLocaleLowerCase().replace(/_/g, '-');
}
