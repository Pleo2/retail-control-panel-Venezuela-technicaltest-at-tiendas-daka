/**
 * Formatea un número como moneda venezolana (Bs.).
 * Ejemplo: 1234.56 -> "1.234,56 Bs."
 * @param value El número a formatear.
 * @param currencySymbol El símbolo de la moneda (por defecto "Bs.").
 * @returns El string formateado.
 */
export function formatVenezuelanCurrency(value: number, currencySymbol: string = 'Bs.'): string {
  if (isNaN(value) || value === null) {
    return `0,00 ${currencySymbol}`
  }
  // Usar toLocaleString es una forma robusta si se configura bien,
  // pero para el formato específico venezolano (punto como separador de miles, coma como decimal)
  // a veces es más directo hacerlo manualmente o con una librería específica si existiera.
  // Para este caso, un enfoque simple:
  const fixedValue = value.toFixed(2) // Asegurar dos decimales
  const parts = fixedValue.split('.')
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') // Añadir puntos como separadores de miles
  const decimalPart = parts[1]

  return `${integerPart},${decimalPart} ${currencySymbol}`
}

/**
 * Formatea un número como moneda USD.
 * Ejemplo: 1234.56 -> "$1,234.56"
 * @param value El número a formatear.
 * @param currencySymbol El símbolo de la moneda (por defecto "$").
 * @returns El string formateado.
 */
export function formatUSDCurrency(value: number, currencySymbol: string = '$'): string {
  if (isNaN(value) || value === null) {
    return `${currencySymbol}0.00`
  }
  return value
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    .replace('$', currencySymbol)
}
