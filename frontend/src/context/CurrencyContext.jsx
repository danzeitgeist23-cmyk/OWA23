import React, { createContext, useContext, useEffect, useState } from 'react';

const RATES = {
  EUR: { symbol: '€', code: 'EUR', rate: 1 },
  USD: { symbol: '$', code: 'USD', rate: 1.08 },
  GBP: { symbol: '£', code: 'GBP', rate: 0.85 },
};

const CURRENCY_STORAGE_KEY = 'owa_currency';
const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    if (typeof window === 'undefined') {
      return 'EUR';
    }

    return window.localStorage.getItem(CURRENCY_STORAGE_KEY) || 'EUR';
  });

  useEffect(() => {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  const info = RATES[currency] || RATES.EUR;

  const convert = (eurAmount) => {
    if (eurAmount == null || Number.isNaN(Number(eurAmount))) {
      return null;
    }

    return Number(eurAmount) * info.rate;
  };

  const format = (eurAmount, opts = {}) => {
    const convertedAmount = convert(eurAmount);
    if (convertedAmount == null) {
      return '';
    }

    const decimals = opts.decimals ?? 0;
    return `${info.symbol}${convertedAmount.toFixed(decimals)}`;
  };

  // Reformats EUR amounts embedded in free text (e.g. "aprox 15€") to the
  // active currency so copy stays consistent with the currency selector.
  const formatText = (text) => {
    if (typeof text !== 'string') {
      return text;
    }

    return text.replace(/(\d+(?:[.,]\d+)?)\s*€/g, (_, amount) =>
      format(Number(amount.replace(',', '.')))
    );
  };

  return (
    <CurrencyContext.Provider
      value={{
        convert,
        currencies: Object.keys(RATES),
        currency,
        format,
        formatText,
        info,
        setCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }

  return context;
}
