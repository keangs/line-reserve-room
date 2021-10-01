import { displayDate } from "./general";
import { sendMsg } from "./line";

export function deleteReserve(liff, event, ref) {
    if (event.key == undefined) return;
    ref.child(event.key).remove();
    if (liff.isInClient()) {
        let msg = `ยกเลิกการจองห้องประชุมเรียบร้อยแล้ว\nห้องประชุม: ${event.name
            }\nวันที่: ${displayDate(
                event.start,
                true,
                false
            )}\nเวลา: ${displayDate(
                event.start,
                false,
                true
            )} - ${displayDate(event.end, false, true)}`;
        sendMsg(liff, msg);
    }
}

export async function getEvent(ref, id = "") {
    let events = [];
    let refQuery = ref
    if (![undefined, ""].includes(id)) {
        refQuery = ref.orderByChild('userId').equalTo(id)
    }
    await refQuery.once("value", snapshot => {
        for (var key in snapshot.val()) {
            let item = snapshot.val()[key];
            item.key = key;
            item.start = new Date(item.start * 1000);
            item.end = new Date(item.end * 1000);
            events.push(item);
        }
    });
    return events
}
