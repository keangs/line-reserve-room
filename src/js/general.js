export function getRoom(room = "") {
  let roomItems = [
    {
      room: 0,
      name: "C",
      color: "red",
      seat: 10,
      image: [
        { src: require("../image/room-c-1.jpg") },
        { src: require("../image/room-c-2.jpg") }
      ]
    },
    {
      room: 1,
      name: "D",
      color: "blue",
      seat: 6,
      image: [
        { src: require("../image/room-d-1.jpg") },
        { src: require("../image/room-d-2.jpg") }
      ]
    },
    {
      room: 2,
      name: "T",
      color: "green",
      seat: 4,
      image: [
        { src: require("../image/room-t-1.jpg") },
        { src: require("../image/room-t-2.jpg") }
      ]
    },
    {
      room: 3,
      name: "CW",
      color: "orange",
      seat: 10,
      image: [
        { src: require("../image/room-cw-1.jpg") },
        { src: require("../image/room-cw-2.jpg") },
        { src: require("../image/room-cw-3.jpg") }
      ]
    }
  ]

  if ([undefined, ""].includes(room)) return roomItems

  return roomItems.filter(
    function (item) { return item.room == room }
  )[0];
}
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


