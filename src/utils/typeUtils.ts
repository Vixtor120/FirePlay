/**
 * Ensures a value is a number. If the value is undefined or null, returns defaultValue.
 * If the value is a string that can be parsed as a number, returns the parsed number.
 * Otherwise, returns the value if it's already a number, or defaultValue.
 */
export function ensureNumber(value: any, defaultValue = 0): number {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  
  return typeof value === 'number' ? value : defaultValue;
}

/**
 * Safely formats a price value to 2 decimal places
 */
export function formatPrice(price: number | undefined | null): string {
  const safePrice = ensureNumber(price);
  return safePrice.toFixed(2);
}

/**
 * Calculates a discounted price based on a given percentage
 */
export function calculateDiscountedPrice(price: number | undefined | null, discountPercentage: number): number {
  const safePrice = ensureNumber(price);
  return safePrice * (1 - discountPercentage / 100);
}

/**
 * Calculates the original price based on the discounted price and discount percentage
 */
export function calculateOriginalPrice(discountedPrice: number | undefined | null, discountPercentage: number): number {
  const safePrice = ensureNumber(discountedPrice);
  return discountPercentage === 100 ? safePrice : safePrice / (1 - discountPercentage / 100);
}
