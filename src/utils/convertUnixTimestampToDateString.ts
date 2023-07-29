export function convertUnixTimestampToDateString(unixTimestamp: number | undefined): string {
  if (!unixTimestamp) {
    return '';
  }

  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds

  // Extract individual date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
