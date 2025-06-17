export const formatCurrency = (money: number | undefined, options?: Intl.NumberFormatOptions | undefined) => {
  return new Intl.NumberFormat(
    'id-ID',
    options || { style: 'currency', currency: 'IDR', notation: 'standard', minimumFractionDigits: 0 }
  ).format(money || 0)
}
