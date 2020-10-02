const _ = require("lodash");

const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");

const conecton = require("../../initFirebase");
const admin = conecton.admin;

const app = express();

app.use(cors({origin: true}));

//Get All Dining Times
app.get("/", async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection("diningTime").get();

        let diningTimes = [];
        snapshot.forEach((doc) => {
            let id = doc.id;
            let data = doc.data();
            diningTimes.push({id, ...data});
        });

        res.status(200).send(createRes("Success", null, diningTimes));
    } catch (e) {
        console.log("Error while performing GET all Dining Time request, Error: ", e);
        res.status(500).send(createRes("Error", "Get All Dining Time Error#" + e.message));
    }
});

app.get("/:code", async (req, res) => {
    try {
        const params = req.params;
        const docRef = admin.firestore().collection("diningTime");

        const docSnapshot = await docRef.doc(params.code).get().then((docSnapshot) => {
            return docSnapshot;
        });

        if (docSnapshot.exists) {
            const data = {id: docSnapshot.id, ...docSnapshot.data()};
            res.status(200).send(createRes("Success", null, data));
        } else {
            res.status(404).send(createRes("Error", "Content Not Found#Dining Type " + params.code + " not found", null));
        }
    } catch (e) {
        console.log("Error while performing GET Dining Time by code request, Error: ", e);
        res.status(500).send(createRes("Error", "Get Dining Time Error#" + e.message));
    }
});

app.post("/", async (req, res) => {
    try {
        const body = processRq(req);
        if (body instanceof Error) {
            res.status(400).send(createRes("Error", body.message, null));
            return;
        }

        const docRef = admin.firestore().collection("diningTime");
        const exist = await docRef.doc(body.code).get().then((docSnapshot) => {
            return docSnapshot.exists;
        });

        if (exist) {
            res.status(400).send(createRes("Error", "Error while create Dining Time#Dining Time " + body.code + " already exist", null));
        } else {
            await docRef.doc(body.code).set(body);
            res.status(201).send(createRes("Success", "Success fully created" + "#" + body.code + " Dining Time created successfully", null));
        }
    } catch (e) {
        console.log("Error while performing Create Dining Time request, Error: ", e);
        res.status(500).send(createRes("Error", "Create Dining Time Error#" + e.message));
    }
});

app.put("/:code", async (req, res) => {
    try {
        const params = req.params;
        const body = createDAO(req);
        if (body instanceof Error) {
            res.status(400).send(createRes("Error", body.message, null));
            return;
        }

        const docRef = admin.firestore().collection("diningTime");
        const exist = await docRef.doc(params.code).get().then((docSnapshot) => {
            return docSnapshot.exists;
        });

        if (exist) {
            await docRef.doc(params.id).update(body);
            res.status(400).send(createRes("Success", "Success fully updated" + "#" + params.code + " Dining Time updated successfully", null));
        } else {
            res.status(200).send(createRes("Error", "Error while update Dining Time#Dining Time + " + params.code + " not found", null));
        }
    } catch (e) {
        console.log("Error while performing Update Dining Time request, Error: ", e);
        res.status(500).send(createRes("Error", "Update Dining Time Error#" + e.message));
    }
});

app.delete("/:code", async (req, res) => {
    try {
        const params = req.params;

        const docRef = admin.firestore().collection("diningTime");
        const exist = await docRef.doc(params.code).get().then((docSnapshot) => {
            return docSnapshot.exists;
        });

        if (exist) {
            await docRef.doc(params.code).delete();
            res.status(200).send(createRes("Success", "Success fully deleted" + "#" + params.code + " Dining Time deleted successfully", null));
        } else {
            res.status(400).send(createRes("Error", "Error while delete Dining Time#Dining Time + " + params.code + " not found", null));
        }
    } catch (e) {
        console.log("Error while performing Update Dining Time request, Error: ", e);
        res.status(500).send(createRes("Error", "Update Dining Time Error#" + e.message));
    }
});

function createRes(statusCode, message, data) {
    const msg = message !== undefined && message !== null ? message.split("#") : [];
    return JSON.stringify({status: {code: statusCode}, message: {short: msg[0], detail: msg[1]}, data: data});
}

function processRq(req) {

    let body = _.pick(req.body, ['code', 'name', 'description', 'from', 'to', 'isActive']);

    if (body.code === undefined || body.code === null) {
        return new Error("Validation Error#Code Not Found");
    }
    if (body.name === undefined || body.name === null) {
        return new Error("Validation Error#Name Not Found");
    }
    if (body.from === undefined || body.from === null) {
        return new Error("Validation Error#From Time Not Found");
    }
    if (body.to === undefined || body.to === null) {
        return new Error("Validation Error#To Time Not Found");
    }
    if (body.isActive === undefined || body.isActive === null) {
        body.isActive = false;
    }

    return body;
}


exports.diningtime = functions.https.onRequest(app);
