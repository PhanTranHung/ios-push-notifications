import express from "express";
import webpush from "web-push";
import dotenv from "dotenv";

const GET_VAPID_PUBLIC_KEY = "/vapid/public-key";
const SEND_NOTIFICATION = "/notification";
const SAVE_SUBCRIPTION = "/notification/subcription";

dotenv.config();

const app = express();

app.use(express.json());

let subscriptionData = null;

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_MAILTO}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

app.get(GET_VAPID_PUBLIC_KEY, async (req, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
})

app.post(SEND_NOTIFICATION, async (req, res) => {
  try {
    await webpush.sendNotification(subscriptionData, JSON.stringify(req.body));
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
})

app.post(SAVE_SUBCRIPTION, async (req, res) => {
  subscriptionData = req.body;
  res.sendStatus(200);
});

app.use(express.static("./public"));

app.listen(process.env.PORT || 8000);
