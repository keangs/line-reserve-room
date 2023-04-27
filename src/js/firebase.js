import { displayDate, getRoom } from "./general";
import { sendMsg } from "./line";
export function deleteReserve(liff, event, ref) {
  if (event.key == undefined) return;
  ref.child(event.key).remove();
  if (liff.isInClient()) {
    let msg = `ยกเลิกการจองห้องประชุมเรียบร้อยแล้ว\nห้องประชุม: ${
      getRoom(event.room).name
    }\nวันที่: ${displayDate(event.start, true, false)}\nเวลา: ${displayDate(
      event.start,
      false,
      true
    )} - ${displayDate(event.end, false, true)}`;
    sendMsg(liff, msg);
  }
}

export async function getEvent(ref, id = "") {
  let events = [];
  let refQuery = ref;
  if (![undefined, ""].includes(id)) {
    refQuery = ref.orderByChild("userId").equalTo(id);
  }

  await refQuery.once("value", async snapshot => {
    let dateCurrent = new Date();

    snapshot.forEach(item => {
      let row = item.val();
      row.key = item.key;
      row.start = new Date(row.start * 1000);
      row.end = new Date(row.end * 1000);
      if (![undefined, ""].includes(id)) {
        if (
          new Date(row.start.toDateString()) >=
          new Date(dateCurrent.toDateString())
        ) {
          events.push(row);
        }
      } else {
        events.push(row);
      }
    });

    // for (const key in snapshot.val()) {
    //   let item = snapshot.val()[key];
    //   item.key = key;
    //   item.start = new Date(item.start * 1000);
    //   item.end = new Date(item.end * 1000);

    //   if (![undefined, ""].includes(id)) {
    //     if (
    //       new Date(item.start.toDateString()) >=
    //       new Date(dateCurrent.toDateString())
    //     ) {
    //       events.push(item);
    //     }
    //   } else {
    //     events.push(item);
    //   }
    // }
  });
  events.sort((a, b) => a.start - b.start);
  // console.log("get event", events);
  return events;
}
