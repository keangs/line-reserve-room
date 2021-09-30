export function displayDate(timestamp, showDate = true, showTime = true) {
    if (timestamp == undefined) return;
    var cDate = new Date(timestamp);
    cDate = new Date(
        cDate.getFullYear(),
        cDate.getMonth(),
        cDate.getDate(),
        cDate.getHours(),
        cDate.getMinutes()
    );

    if (showDate && showTime) {
        return cDate.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
            hour: "numeric",
            minute: "numeric"
        });
    }

    if (showDate) {
        return cDate.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short"
        });
    }

    if (showTime) {
        return cDate.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }
}

export function getThaiMonth(month) {
    if (Number(month) < 1 && Number(month) > 12) return ""
    var monthNamesThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤษจิกายน", "ธันวาคม"];
    return monthNamesThai[Number(month) - 1]
}

export function convertToTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}

export function convertToDate(date, time) {
    var dateString = date + " " + time,
        dateTimeParts = dateString.split(" "),
        timeParts = dateTimeParts[1].split(":"),
        dateParts = dateTimeParts[0].split("-")
    return new Date(
        dateParts[2],
        parseInt(dateParts[1], 10) - 1,
        dateParts[0],
        timeParts[0],
        timeParts[1]
    );
}

export function convertDateYYYYMMDD(date, delimiter = "", toAD = false, swap = false) {
    let cDate = date.toString().padEnd(8, "0")
    let [year, month, day] = [
        cDate.substring(0, 4),
        cDate.substring(4, 6),
        cDate.substring(6),
    ]
    if (toAD) {
        year -= 543
    }
    if (swap) {
        return `${year}${delimiter}${month}${delimiter}${day}`
    } else {
        return `${day}${delimiter}${month}${delimiter}${year}`
    }
}


