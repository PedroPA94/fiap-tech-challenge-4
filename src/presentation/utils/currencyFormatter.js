const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value) => {
  const formatted = currencyFormatter.format(Math.abs(value));
  return value < 0 ? `- R$ ${formatted}` : `R$ ${formatted}`;
};
