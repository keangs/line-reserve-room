export async function getEvent(ref, id) {
    let events = [];
    let refQuery = ref
    if ([undefined, ""].includes(id)) {
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
