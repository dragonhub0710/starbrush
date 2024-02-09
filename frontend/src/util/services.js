// Function to set data with expiry
export function setWithExpiry(key, value) {
  const now = parseInt(getCurrentFormattedTime());
  const item = {
    value: value,
    expiry: now + 30 * 60,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

// Function to get data and handle expiry
export function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = parseInt(getCurrentFormattedTime());
  if (now > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

export function getCurrentFormattedTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
