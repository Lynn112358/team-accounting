const SYMBOLS: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
  KRW: '₩',
  HKD: 'HK$',
  TWD: 'NT$',
  THB: '฿',
  SGD: 'S$',
  AUD: 'A$',
  CAD: 'C$',
}

export function getCurrencySymbol(currency: string): string {
  return SYMBOLS[currency] || currency
}

export function formatMoney(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${amount.toFixed(2)}`
}

export function convertToBase(
  amount: number,
  fromCurrency: string,
  baseCurrency: string,
  rates: Record<string, number>,
): number {
  if (fromCurrency === baseCurrency) return amount
  const fromRate = rates[fromCurrency]
  const baseRate = rates[baseCurrency]
  if (!fromRate || !baseRate) return amount
  return (amount * fromRate) / baseRate
}

export const CURRENCIES = [
  'CNY',
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'KRW',
  'HKD',
  'TWD',
  'THB',
  'SGD',
  'AUD',
  'CAD',
] as const
