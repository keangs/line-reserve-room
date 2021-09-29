export function getURLParams(href) {
    let uri = href.split("?");
    if (uri.length == 2) {
        let vars = uri[1].split("&");
        let getVars = {};
        let tmp = "";
        vars.forEach(function (v) {
            tmp = v.split("=");
            if (tmp.length == 2) getVars[tmp[0]] = tmp[1];
        });
        return getVars
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


