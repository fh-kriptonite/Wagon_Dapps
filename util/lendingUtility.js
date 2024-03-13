export function translateStatus(status) {
    status = parseInt(status)

    // status: 1 = pool created ; 2 = pool start ; 3 = paid ; 4 = default ; 5 = disburse default
    switch (status) {
        case 1:
            return "Open";
        case 2:
            return "Active";
        case 3:
            return "Close";
        case 4:
            return "Default";
        case 5:
            return "Disburse Default";
        case 6:
            return "Canceled";
        default:
            return "NA"
    }
}

export function showPool(filter, poolStatus) {
    poolStatus = parseInt(poolStatus)

    // filter: 1 = open ; 2 = active; 3 = close
    // status: 1 = pool created ; 2 = pool start ; 3 = paid ; 4 = default ; 5 = disburse default
    
    if(filter == 1 && poolStatus == 1) return true;
    if(filter == 2 && poolStatus == 2) return true;
    if(filter == 3 && poolStatus > 2) return true;
    
    return false;
}

export function calculateApy(pool) {
    const apy = pool?.targetInterestPerPayment / pool?.targetLoan * 12 * 100
    return(apy);
}

export function formatTime(seconds) {
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = 2592000; // Assuming 30 days in a month
    const secondsInYear = 31536000; // Assuming 365 days in a year

    let years = Math.floor(seconds / secondsInYear);
    let months = Math.floor((seconds % secondsInYear) / secondsInMonth);
    let days = Math.floor(((seconds % secondsInYear) % secondsInMonth) / secondsInDay);
    let hours = Math.floor((((seconds % secondsInYear) % secondsInMonth) % secondsInDay) / secondsInHour);
    let remainingSeconds = (((seconds % secondsInYear) % secondsInMonth) % secondsInDay) % secondsInHour;

    let output = '';
    if (years > 0) {
        output += years + (years === 1 ? ' year' : ' years') + ', ';
    }
    if (months > 0) {
        output += months + (months === 1 ? ' month' : ' months') + ', ';
    }
    if (days > 0) {
        output += days + (days === 1 ? ' day' : ' days') + ', ';
    }
    if (hours > 0) {
        output += hours + (hours === 1 ? ' hour' : ' hours') + ', ';
    }
    if (remainingSeconds > 0) {
        output += remainingSeconds + (remainingSeconds === 1 ? ' second' : ' seconds');
    }

    // Remove trailing comma and space
    output = output.replace(/, $/, '');

    return output;
}