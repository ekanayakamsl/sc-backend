const _ = require("lodash");

const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");

const con = require("../../initFirebase");
const admin = con.admin;

const app = express();

app.use(cors({origin: true}));

app.get("/", async (req, res) => {
    const snapshot = await admin.firestore().collection("customerTypes").get();

    let customerTypes = [];
    snapshot.forEach((doc) => {
        let id = doc.id;
        let data = doc.data();
        customerTypes.push({id, ...data});
    });
    res.status(200).send(createRes("Success", null, customerTypes));
});

app.get("/:code", async (req, res) => {
    try {
        const params = req.params;

        const docRef = admin.firestore().collection("customerTypes");

        const docSnapshot = await docRef.doc(req.params.id).get().then((docSnapshot) => {
            return docSnapshot;
        });

        if (docSnapshot.exists) {
            const data = JSON.stringify({id: docSnapshot.id, ...docSnapshot.data()});
            res.status(200).send(createRes("Success", null, data));
        } else {
            res.status(204).send(createRes("Error", "Content Not Found#Customer Type " + params.id + " not found", null));
        }
    } catch (e) {
        console.log("Error while performing GET Customer Type by code request, Error: ", e);
        res.status(500).send(createRes("Error", "Get Dining Time Error#" + e.message));
    }
});

app.post("/", async (req, res) => {
    const body = createDAO(req);

    if (body instanceof Error) {
        res.status(400).send(createRes("Error", body.message, null));
        return;
    }

    const docRef = admin.firestore().collection("customerTypes");

    const exist = await docRef.doc(body.code).get().then((docSnapshot) => {
        return docSnapshot.exists;
    });

    if (exist) {
        res.status(400).send(createRes("Error", "Error while create#Error While Create Customer Type"));
    } else {
        await docRef.doc(body.code).set(body);
        res.status(201).send(createRes("Success", "Success fully created" + "#" + body.code + " Customer Type created successfully", null));
    }
});

app.put("/:id", async (req, res) => {
    try {
        const body = createDAO(req);

        if (body instanceof Error) {
            res.status(400).send(createRes("Error", body.message, null));
            return;
        }

        const params = req.params;

        const docRef = admin.firestore().collection("customerTypes");

        const exist = await docRef.doc(req.params.id).get().then((docSnapshot) => {
            return docSnapshot.exists;
        });

        if (exist) {
            await docRef.doc(params.id).update(body);
            res.status(205).send(createRes("Error", "Error while update#Error While Update Customer Type"));
        } else {
            res.status(204).send(createRes("Success", "Success fully updated" + "#" + body.code + " Customer Type updated successfully", null));
        }
    } catch (e) {
        console.log(e);
    }
});

app.delete("/:id", async (req, res) => {
    const params = req.params;

    const docRef = admin.firestore().collection("customerTypes");

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

function createRes(statusCode, message, data) {
    const msg = message !== undefined && message !== null ? message.split("#") : [];
    return JSON.stringify({status: {code: statusCode}, message: {short: msg[0], detail: msg[1]}, data: data});
}

function createDAO(req) {

    let body = _.pick(req.body, ['code', 'name', 'internal']);

    if (body.code === undefined || body.code === null) {
        return new Error("Validation Error#Code Not Found");

    }
    if (body.name === undefined || body.name === null) {
        return new Error("Validation Error#Name Not Found");
    }
    if (body.internal === undefined || body.internal === null) {
        body.internal = false;
    }

    return body;
}


exports.customertype = functions.https.onRequest(app);
