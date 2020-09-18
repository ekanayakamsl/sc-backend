const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");

const conecton = require("./initFirebase");
const admin = conecton.admin;

const app = express();

app.use(cors({ origin: true }));

app.post("/", async (req, res) => {
  const item = req.body;
  const diningTimeRef = admin.firestore().collection("diningTime").doc(item.name);

  await diningTimeRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          return res.status(205).send();
        } else {
          return usersRef.set(item); // create the document
        }
      });
  // await admin.firestore().collection("diningTime").doc(item.name).set(item);
  res.status(201).send();
});

app.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("diningTime").get();

  let diningTimes = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();
    diningTimes.push({ id, ...data });
  });
  res.status(200).send(JSON.stringify(diningTimes));
});

app.get("/:name", async (req, res) => {
  const snapshot = await admin
    .firestore()
    .collection("diningTime")
    .doc(req.params.name)
    .get();
  const menuId = snapshot.id;
  const data = snapshot.data();
  res.status(200).send(JSON.stringify({ id: menuId, ...data }));
});

app.put("/:name", async (req, res) => {
  const body = req.body;
  await admin.firestore().collection("diningTime").doc(req.params.name).update(body);
  res.status(200).send();
});

app.delete("/:name", async (req, res) => {
  await admin.firestore().collection("diningTime").doc(req.params.name).delete();
  res.status(200).send();
});

exports.diningtime = functions.https.onRequest(app);
