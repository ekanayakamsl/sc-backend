const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");

const con = require("../../initFirebase");
const admin = con.admin;

const app = express();

app.use(cors({origin: true}));

app.get("/", async (req, res) => {
    const snapshot = await admin.firestore().collection("customer-types").get();

    let customerTypes = [];
    snapshot.forEach((doc) => {
        let id = doc.id;
        let data = doc.data();
        customerTypes.push({id, ...data});
    });
    res.status(200).send(JSON.stringify(customerTypes));
});

app.get("/:id", async (req, res) => {
    const params = req.params;

    const docRef = admin.firestore().collection("customer-types");

    const exist = await docRef.doc(req.params.id).get().then((docSnapshot) => {
        return docSnapshot.exists;
    });

    if (exist) {
        await docRef.doc(req.params.id).get();
        res.status(200).send(JSON.stringify({id: snapshot.id, ...snapshot.data()}));
    }
    else {
        res.status(204).send();
    }

});

app.post("/", async (req, res) => {
    const body = req.body;

    const docRef = admin.firestore().collection("customer-types");

    const exist = await docRef.doc(body.code).get().then((docSnapshot) => {
        return docSnapshot.exists;
    });

    if (exist) {
        res.status(400).send();
    } else {
        await docRef.doc(body.code).set(body);
        res.status(201).send();
    }
});

app.put("/:id", async (req, res) => {
    try {
        const body = req.body;
        const params = req.params;

        const docRef = admin.firestore().collection("customer-types");

        const exist = await docRef.doc(req.params.id).get().then((docSnapshot) => {
            return docSnapshot.exists;
        });

        if (exist) {
            await docRef.doc(params.id).update(body);
            res.status(205).send();
        } else {
            res.status(204).send();
        }
    } catch (e) {
        console.log(e);
    }
});

app.delete("/:id", async (req, res) => {
    const params = req.params;

    const docRef = admin.firestore().collection("customer-types");

    const exist = await docRef.doc(req.params.id).get().then((docSnapshot) => {
        return docSnapshot.exists;
    });

    if (exist) {
        await docRef.doc(params.id).delete();
        res.status(202).send();
    } else {
        res.status(204).send();
    }
});

exports.customertype = functions.https.onRequest(app);
