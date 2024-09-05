import axios from "axios";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
export async function sendMsg(liff, text) {
  if (liff.getContext().type !== "none") {
    await liff.sendMessages([
      {
        type: "text",
        text: text,
      },
    ]);
  }
}

export function sendMsgNotify(liff, text) {
  axios.post(
    "https://heroic-griffin-06bea4.netlify.app/api/notify",
    {
      message: text,
    },
    {
      headers: { Authorization: `Basic ${liff.getAccessToken()}` },
    }
  );
}
