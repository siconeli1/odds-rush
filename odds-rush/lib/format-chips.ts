export function formatChips(amount: number): string {
  return amount.toFixed(2).replace('.', ',');
}
