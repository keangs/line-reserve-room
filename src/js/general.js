import moment from "moment";

export function getRoom(room = "") {
  let roomItems = [
    {
      room: 0,
      name: "C",
      color: "red",
      seat: 10,
      image: [
        { src: require("../image/room-c-1.jpg") },
        { src: require("../image/room-c-2.jpg") },
      ],
    },
    {
      room: 1,
      name: "D",
      color: "blue",
      seat: 6,
      image: [
        { src: require("../image/room-d-1.jpg") },
        { src: require("../image/room-d-2.jpg") },
      ],
    },
    {
      room: 2,
      name: "T",
      color: "green",
      seat: 4,
      image: [
        { src: require("../image/room-t-1.jpg") },
        { src: require("../image/room-t-2.jpg") },
      ],
    },
    {
      room: 3,
      name: "CW",
      color: "orange",
      seat: 10,
      image: [
        { src: require("../image/room-cw-1.jpg") },
        { src: require("../image/room-cw-2.jpg") },
        { src: require("../image/room-cw-3.jpg") },
      ],
    },
    {
      room: 4,
      name: "I",
      color: "purple",
      seat: 3,
      image: [
        { src: require("../image/room-i-1.jpg") },
        { src: require("../image/room-i-2.jpg") },
        { src: require("../image/room-i-3.jpg") },
      ],
    },
    {
      room: 5,
      name: "E",
      color: "teal",
      seat: 2,
      image: [{ src: require("../image/room-e-1.jpg") }],
    },
    {
      room: 6,
      name: "S",
      color: "brown",
      seat: 4,
      image: [{ src: require("../image/room-s-1.jpg") }],
    },
    {
      room: 7,
      name: "G",
      color: "indigo",
      seat: 2,
      image: [{ src: require("../image/room-g-1.jpg") }],
    },
    {
      room: 8,
      name: "WS",
      color: "cyan",
      seat: 18,
      image: [
        { src: require("../image/room-ws-1.jpg") },
        { src: require("../image/room-ws-2.jpg") },
      ],
    },
  ];

  if ([undefined, ""].includes(room)) return roomItems;

  return roomItems.filter(function (item) {
    return item.room == room;
  })[0];
}
export function displayDate(timestamp, showDate = true, showTime = true) {
  if (timestamp == undefined) return;
  let cDate = new Date(timestamp);
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
      minute: "numeric",
    });
  }

  if (showDate) {
    return cDate.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  }

  if (showTime) {
    return cDate.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export function getThaiMonth(month) {
  if (Number(month) < 1 && Number(month) > 12) return "";
  let monthNamesThai = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤษจิกายน",
    "ธันวาคม",
  ];
  return monthNamesThai[Number(month) - 1];
}

export function convertToTimestamp(strDate) {
  let datum = Date.parse(strDate);
  return datum / 1000;
}

export function convertToDate(date, time) {
  let dateString = date + " " + time,
    dateTimeParts = dateString.split(" "),
    timeParts = dateTimeParts[1].split(":"),
    dateParts = dateTimeParts[0].split("-");
  return new Date(
    dateParts[2],
    parseInt(dateParts[1], 10) - 1,
    dateParts[0],
    timeParts[0],
    timeParts[1]
  );
}

export function convertDateYYYYMMDD(
  date,
  delimiter = "",
  toAD = false,
  swap = false
) {
  let cDate = date.toString().padEnd(8, "0");
  let [year, month, day] = [
    cDate.substring(0, 4),
    cDate.substring(4, 6),
    cDate.substring(6),
  ];
  if (toAD) {
    year -= 543;
  }
  if (swap) {
    return `${year}${delimiter}${month}${delimiter}${day}`;
  } else {
    return `${day}${delimiter}${month}${delimiter}${year}`;
  }
}

export function generateDateRange(
  type,
  startDateBuddhist,
  endDateBuddhist,
  every = 1,
  daysOfWeek = [],
  dayOfMonth = null,
  weeksOfMonth = []
) {
  // แปลงปี พ.ศ. เป็นปี ค.ศ.
  const startDate = moment(String(startDateBuddhist), "YYYYMMDD").subtract(
    543,
    "years"
  );
  const endDate = moment(String(endDateBuddhist), "YYYYMMDD").subtract(
    543,
    "years"
  );

  // ตรวจสอบว่า startDate และ endDate ถูกต้องหรือไม่
  if (
    !startDate.isValid() ||
    !endDate.isValid() ||
    startDate.isAfter(endDate) ||
    every < 1
  ) {
    throw new Error("กรุณาตรวจสอบวันที่เริ่มต้น สิ้นสุด และค่า every");
  }

  if (type == 1) {
    // สร้างรายการวันที่ระหว่าง startDate และ endDate ตามค่า every
    const dateList = [];
    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      dateList.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(every, "days");
    }

    return dateList;
  }

  if (type == 2) {
    // แปลงตัวเลขของวันเป็นดัชนีของวันในสัปดาห์ (1 = จันทร์, ..., 7 = อาทิตย์)
    const daysOfWeekIndices = daysOfWeek
      .map((day) => parseInt(day, 10) % 7)
      .filter((index) => index >= 0 && index <= 6);

    if (daysOfWeekIndices.length === 0) {
      throw new Error("กรุณาระบุวันที่ในสัปดาห์ที่ถูกต้อง (1-7)");
    }

    const dateList = [];

    // สร้างรายการวันที่ระหว่าง startDate และ endDate ตาม daysOfWeek และ every
    let currentDate = startDate.clone();
    let weekCounter = 0; // ตัวนับจำนวนสัปดาห์ที่ผ่านไป

    while (currentDate.isSameOrBefore(endDate)) {
      // ตรวจสอบว่า currentDate ตรงกับวันที่ใน daysOfWeek หรือไม่
      if (daysOfWeekIndices.includes(currentDate.isoWeekday())) {
        // ตรวจสอบว่าตรงกับ every อาทิตย์หรือไม่
        if (weekCounter % every === 0) {
          dateList.push(currentDate.format("YYYY-MM-DD"));
        }
      }

      // เพิ่มวันทีละ 1 วัน
      currentDate.add(1, "days");

      // หาก currentDate เป็นวันอาทิตย์ (สิ้นสุดสัปดาห์) ให้เพิ่มตัวนับ weekCounter
      if (currentDate.isoWeekday() === 1) {
        // isoWeekday() === 1 หมายถึงวันจันทร์ของสัปดาห์ใหม่
        weekCounter++;
      }
    }

    return dateList;
  }

  if (type === 3) {
    // Logic for type 3
    const dayOfMonthInt = parseInt(dayOfMonth, 10);

    if (isNaN(dayOfMonthInt) || dayOfMonthInt < 1 || dayOfMonthInt > 31) {
      throw new Error("กรุณาระบุวันที่ในเดือนที่ถูกต้อง (1-31)");
    }

    const dateList = [];
    let currentDate = startDate.clone();
    let monthCounter = 0;

    while (currentDate.isSameOrBefore(endDate)) {
      if (currentDate.date() === dayOfMonthInt) {
        if (monthCounter % every === 0) {
          dateList.push(currentDate.format("YYYY-MM-DD"));
        }
      }
      currentDate.add(1, "days");
      if (currentDate.date() === 1) {
        monthCounter++;
      }
    }
    return dateList;
  }

  if (type === 4) {
    // Logic for type 4
    const weekMap = {
      แรก: 1,
      ที่สอง: 2,
      ที่สาม: 3,
      ที่สี่: 4,
      สุดท้าย: -1,
    };

    const weekNumbers = weeksOfMonth
      .map((week) => weekMap[week])
      .filter((week) => week !== undefined);

    if (weekNumbers.length === 0) {
      throw new Error(
        "กรุณาระบุสัปดาห์ที่ถูกต้อง (เช่น 'แรก', 'ที่สอง', 'สุดท้าย')"
      );
    }

    const dayMap = {
      อาทิตย์: 7,
      จันทร์: 1,
      อังคาร: 2,
      พุธ: 3,
      พฤหัสบดี: 4,
      ศุกร์: 5,
      เสาร์: 6,
    };

    const daysOfWeekIndices = daysOfWeek
      .map((day) => dayMap[day])
      .filter((index) => index !== undefined);

    if (daysOfWeekIndices.length === 0) {
      throw new Error(
        "กรุณาระบุวันที่ในสัปดาห์ที่ถูกต้อง (เช่น 'จันทร์', 'อังคาร', 'พุธ')"
      );
    }

    const dateList = [];
    let currentDate = startDate.clone();
    let monthCounter = 0; // Counter to handle every N months

    while (currentDate.isSameOrBefore(endDate)) {
      const currentMonth = currentDate.month();

      if (monthCounter % every === 0) {
        weekNumbers.forEach((week) => {
          daysOfWeekIndices.forEach((day) => {
            let targetDate;

            if (week === -1) {
              // Handle "สุดท้าย"
              targetDate = currentDate.clone().endOf("month").isoWeekday(day);
              if (targetDate.month() !== currentMonth) {
                targetDate.subtract(7, "days");
              }
            } else {
              // Handle specific weeks
              targetDate = currentDate.clone().startOf("month").isoWeekday(day);

              // If the first occurrence is in the previous month, move to the next week
              if (targetDate.month() !== currentMonth) {
                targetDate.add(7, "days");
              }

              // Add weeks to reach the target week
              targetDate.add((week - 1) * 7, "days");
            }

            if (
              targetDate.isSameOrAfter(currentDate) &&
              targetDate.isSameOrBefore(endDate) &&
              targetDate.month() === currentMonth
            ) {
              dateList.push(targetDate.format("YYYY-MM-DD"));
            }
          });
        });
      }

      currentDate.add(1, "months").startOf("month");
      monthCounter++;
    }

    return dateList;
  }
}
