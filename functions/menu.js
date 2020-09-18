const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");

const conecton = require("./initFirebase");
const admin = conecton.admin;

const app = express();

app.use(cors({ origin: true }));

app.post("/", async (req, res) => {
  const menu = req.body;
  await admin.firestore().collection("menus").add(menu);
  res.status(201).send();
});

app.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("menus").get();

  let menus = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();
    menus.push({ id, ...data });
  });
  res.status(200).send(JSON.stringify(menus));
});

app.get("/:id", async (req, res) => {
  const snapshot = await admin
    .firestore()
    .collection("menus")
    .doc(req.params.id)
    .get();
  const menuId = snapshot.id;
  const menuData = snapshot.data();
  res.status(200).send(JSON.stringify({ id: menuId, ...menuData }));
});

app.put("/:id", async (req, res) => {
  const body = req.body;
  await admin.firestore().collection("menus").doc(req.params.id).update(body);
  res.status(200).send();
});

app.delete("/:id", async (req, res) => {
  await admin.firestore().collection("menus").doc(req.params.id).delete();

  res.status(200).send();
});

exports.menu = functions.https.onRequest(app);
