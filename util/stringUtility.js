export function numberWithCommas(x, digits) {
  var parts = Number(x).toFixed(digits).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function numberWithLetter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

export function formatDate(date) {
  // Format the date object into the desired format "Jan 21, 2024"
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
}

export function shortenAddress(address, length = 4) {
  if (address.length <= 8) return address; // Address is already short

  const prefix = address.slice(0, length);
  const suffix = address.slice(-length);

  return `${prefix}...${suffix}`;
}

export function convertTime(seconds) {
  if (seconds < 0) {
      return "Invalid input"; // Assuming negative seconds are invalid
  }

  const minute = 60;
  const hour = 3600;
  const day = 86400;

  if (seconds < minute) {
      return seconds + " seconds";
  } else if (seconds < hour) {
      return Math.floor(seconds / minute) + " minutes";
  } else if (seconds < day) {
      return Math.floor(seconds / hour) + " hours";
  } else {
      return Math.floor(seconds / day) + " days";
  }
}