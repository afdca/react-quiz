/**
 * Adapted from stackoverflow: https://stackoverflow.com/a/6313008
 * For a larger project this should be replaced with a dedicated library
 */
export function formatDuration(durationMs: number): string {
  const sec_num = durationMs / 1_000
  const hours = Math.floor(sec_num / 3600)
  const minutes = Math.floor((sec_num - hours * 3600) / 60)
  const seconds = sec_num - hours * 3600 - minutes * 60
  return String(hours)
    .concat("h")
    .concat(minutes < 10 ? "0" : "")
    .concat(String(minutes))
    .concat("min")
    .concat(seconds < 10 ? "0" : "")
    .concat(String(seconds))
    .concat("s")
}
