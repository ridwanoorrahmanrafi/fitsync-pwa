/** Returns today's date as YYYY-MM-DD (local ISO slice) */
export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function dateStringToMs(dateStr) {
  return new Date(dateStr).getTime();
}

