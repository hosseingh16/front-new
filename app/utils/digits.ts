/** Persian (۰-۹) and Arabic-Indic (٠-٩) digits → ASCII 0-9. */
export function toEnglishDigits(value: string): string {
  return value.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (char) => {
    const code = char.charCodeAt(0)
    if (code >= 0x06f0 && code <= 0x06f9) return String(code - 0x06f0)
    return String(code - 0x0660)
  })
}
