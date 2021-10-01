export async function sendMsg(liff, text) {
    if (liff.getContext().type !== "none") {
        await liff.sendMessages([
            {
                type: "text",
                text: text
            }
        ]);
    }
}
