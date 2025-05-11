// Import functions from Vitest
import { describe, it, expect } from 'vitest'

// Import the functions to be tested
import { formatVenezuelanCurrency, formatUSDCurrency } from '../currencyFormatter' // Adjust path

describe('currencyFormatter.ts', () => {
  // Test Suite for formatVenezuelanCurrency
  describe('formatVenezuelanCurrency', () => {
    it('correctly formats a positive number with default symbol', () => {
      expect(formatVenezuelanCurrency(1234.56)).toBe('1.234,56 Bs.')
    })

    it('correctly formats a number with no decimals', () => {
      expect(formatVenezuelanCurrency(5000)).toBe('5.000,00 Bs.')
    })

    it('correctly formats a number with one decimal place', () => {
      expect(formatVenezuelanCurrency(123.4)).toBe('123,40 Bs.')
    })

    it('correctly formats a small number', () => {
      expect(formatVenezuelanCurrency(0.75)).toBe('0,75 Bs.')
    })

    it('correctly formats zero', () => {
      expect(formatVenezuelanCurrency(0)).toBe('0,00 Bs.')
    })

    it('correctly formats a large number', () => {
      expect(formatVenezuelanCurrency(1234567.89)).toBe('1.234.567,89 Bs.')
    })

    it('uses a custom currency symbol when provided', () => {
      expect(formatVenezuelanCurrency(100.0, 'VEF')).toBe('100,00 VEF')
    })

    it('handles NaN input', () => {
      expect(formatVenezuelanCurrency(NaN)).toBe('0,00 Bs.')
    })

    it('handles null input', () => {
      // @ts-expect-error Testing invalid input explicitly
      expect(formatVenezuelanCurrency(null)).toBe('0,00 Bs.')
    })

    it('handles undefined input', () => {
      // @ts-expect-error Testing invalid input explicitly
      expect(formatVenezuelanCurrency(undefined)).toBe('0,00 Bs.')
    })

    it('correctly formats a negative number', () => {
      // Current implementation doesn't explicitly handle negative signs before thousands separator
      // For -1234.56, it would produce "-1.234,56 Bs." which is usually acceptable.
      expect(formatVenezuelanCurrency(-1234.56)).toBe('-1.234,56 Bs.')
    })
  })

  // Test Suite for formatUSDCurrency
  describe('formatUSDCurrency', () => {
    it('correctly formats a positive number with default symbol', () => {
      // toLocaleString('en-US', { style: 'currency', currency: 'USD' }) for 1234.56 is "$1,234.56"
      expect(formatUSDCurrency(1234.56)).toBe('$1,234.56')
    })

    it('correctly formats a number with no decimals', () => {
      expect(formatUSDCurrency(5000)).toBe('$5,000.00')
    })

    it('correctly formats a number with one decimal place', () => {
      expect(formatUSDCurrency(123.4)).toBe('$123.40')
    })

    it('correctly formats a small number', () => {
      expect(formatUSDCurrency(0.75)).toBe('$0.75')
    })

    it('correctly formats zero', () => {
      expect(formatUSDCurrency(0)).toBe('$0.00')
    })

    it('correctly formats a large number', () => {
      expect(formatUSDCurrency(1234567.89)).toBe('$1,234,567.89')
    })

    it('uses a custom currency symbol when provided', () => {
      expect(formatUSDCurrency(100.0, 'USD ')).toBe('USD 100.00') // toLocaleString prepends its own $, so the replace logic matters.
      // If symbol is "USD ", output becomes "USD $100.00"
      // If symbol is just "€", output becomes "€100.00" (after US$ is replaced)
    })

    it('uses a custom currency symbol like Euro', () => {
      expect(formatUSDCurrency(100.0, '€')).toBe('€100.00')
    })

    it('handles NaN input', () => {
      expect(formatUSDCurrency(NaN)).toBe('$0.00')
    })

    it('handles null input', () => {
      // @ts-expect-error Testing invalid input explicitly
      expect(formatUSDCurrency(null)).toBe('$0.00')
    })

    it('handles undefined input', () => {
      // @ts-expect-error Testing invalid input explicitly
      expect(formatUSDCurrency(undefined)).toBe('$0.00')
    })

    it('correctly formats a negative number', () => {
      // toLocaleString handles negatives well: e.g., "-$1,234.56"
      expect(formatUSDCurrency(-1234.56)).toBe('-$1,234.56')
    })
  })
})
