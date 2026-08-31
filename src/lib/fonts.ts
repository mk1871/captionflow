export const availableFonts = [
  'Inter',
  'Roboto',
  'Lato',
  'Montserrat',
  'Open Sans',
  'Noto Sans',
] as const

export type FontName = (typeof availableFonts)[number]

export const fontWeightsByFont: Record<FontName, readonly number[]> = {
  Inter: [500, 600, 700, 800],
  Roboto: [500, 700, 900],
  Lato: [700, 900],
  Montserrat: [600, 700, 800, 900],
  'Open Sans': [600, 700, 800],
  'Noto Sans': [500, 700, 900],
}

export function normalizeWeight(font: string, weight: number): number {
  const weights = fontWeightsByFont[font as FontName] ?? [700]
  return weights.includes(weight) ? weight : (weights[0] ?? 700)
}
