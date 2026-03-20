export const currencySymbols: Record<string, string> = {
  "USD - US Dollar": "$",
  "EUR - Euro": "€",
  "GBP - British Pound": "£",
  "INR - Indian Rupee": "₹",
  "AED - UAE Dirham": "د.إ",
};

/** Returns the currency symbol for a given currency key, defaulting to "$". */
export const getCurrencySymbol = (currency?: string | null): string =>
  (currency && currencySymbols[currency]) || "$";
