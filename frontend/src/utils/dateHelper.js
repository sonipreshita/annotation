const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function timeDifference(date) {
    let currentDate = new Date();
    let currentTimeStamp = new Date(date).getTime();
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;
    let elapsed = currentDate - currentTimeStamp;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}

export function formatAMPM(dateOld) {
    let date = new Date(dateOld);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;

    return strTime;
}

export function formatDateActivity(dateOld) {
    let today = new Date();
    let date = new Date(dateOld);
    let dateToday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let getDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    return dateToday === getDate ? 'Today' : day + " " + monthNames[month] + " " + year;
}

export function dateContinueCheck(dateOld) {
    let date = new Date(dateOld);
    let getDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    return getDate;
}