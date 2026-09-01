export const availableFonts = [
  'Inter Variable',
  'Roboto Variable',
  'Lato',
  'Montserrat Variable',
  'Open Sans Variable',
  'Noto Sans Variable',
] as const

export type FontName = (typeof availableFonts)[number]

export const fontWeightsByFont: Record<FontName, readonly number[]> = {
  'Inter Variable': [500, 600, 700, 800],
  'Roboto Variable': [500, 700, 900],
  Lato: [700, 900],
  'Montserrat Variable': [600, 700, 800, 900],
  'Open Sans Variable': [600, 700, 800],
  'Noto Sans Variable': [500, 700, 900],
}

export function normalizeWeight(font: string, weight: number): number {
  const weights = fontWeightsByFont[font as FontName] ?? [700]
  return weights.includes(weight) ? weight : (weights[0] ?? 700)
}

const legacyToVariable: Record<string, string> = {
  Inter: 'Inter Variable',
  Roboto: 'Roboto Variable',
  Montserrat: 'Montserrat Variable',
  'Open Sans': 'Open Sans Variable',
  'Noto Sans': 'Noto Sans Variable',
}

export function migrateFontName(font: string): string {
  return legacyToVariable[font] ?? font
}
