const _ = require("lodash");

const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");

const con = require("../../initFirebase");
const admin = con.admin;

const app = express();

app.use(cors({origin: true}));

app.get("/", async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection("customerTypes").get();

        let customerTypes = [];
        snapshot.forEach((doc) => {
            let id = doc.id;
            let data = doc.data();
            customerTypes.push({id, ...data});
        });
        res.status(200).send(createRes("Success", null, customerTypes));
    } catch (e) {
        console.log("Error while performing GET all Customer Types request, Error: ", e);
        res.status(500).send(createRes("Error", "Get All Customer Types Error#" + e.message));
    }
});

app.get("/:code", async (req, res) => {
    try {
        const params = req.params;

        const docRef = admin.firestore().collection("customerTypes");
        const docSnapshot = await docRef.doc(params.code).get().then((docSnapshot) => {
            return docSnapshot;
        });

        if (docSnapshot.exists) {
            const data = JSON.stringify({id: docSnapshot.id, ...docSnapshot.data()});
            res.status(200).send(createRes("Success", null, data));
        } else {
            res.status(404).send(createRes("Error", "Content Not Found#Customer Type " + params.id + " not found", null));
        }
    } catch (e) {
        console.log("Error while performing GET Customer Type by code request, Error: ", e);
        res.status(500).send(createRes("Error", "Get Customer Type Error#" + e.message));
    }
});

app.post("/", async (req, res) => {
    try {
        const body = processRq(req);

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
    }
    catch (e) {
        console.log("Error while performing Create Customer Type request, Error: ", e);
        res.status(500).send(createRes("Error", "Create Customer Type Error#" + e.message));
    }
});

app.put("/:code", async (req, res) => {
    try {
        const body = processRq(req);

        if (body instanceof Error) {
            res.status(400).send(createRes("Error", body.message, null));
            return;
        }

        const params = req.params;

        const docRef = admin.firestore().collection("customerTypes");

        const exist = await docRef.doc(params.code).get().then((docSnapshot) => {
            return docSnapshot.exists;
        });

        if (exist) {
            await docRef.doc(params.code).update(body);
            res.status(200).send(createRes("Error", "Error while update#Error While Update Customer Type"));
        } else {
            res.status(400).send(createRes("Success", "Success fully updated" + "#" + body.code + " Customer Type updated successfully", null));
        }
    } catch (e) {
        console.log("Error while performing Update Customer Type request, Error: ", e);
        res.status(500).send(createRes("Error", "Update Customer Type Error#" + e.message));
    }
});

app.delete("/:code", async (req, res) => {
    const params = req.params;

    const docRef = admin.firestore().collection("customerTypes");
    const exist = await docRef.doc(req.params.code).get().then((docSnapshot) => {
        return docSnapshot.exists;
    });

    if (exist) {
        await docRef.doc(params.id).delete();
        res.status(200).send(createRes("Success", "Success fully deleted" + "#" + params.code + " Customer Type deleted successfully", null));
    } else {
        res.status(400).send(createRes("Error", "Error while delete Customer Type#Customer Type + " + params.code + " not found", null));
    }
});

function createRes(statusCode, message, data) {
    const msg = message !== undefined && message !== null ? message.split("#") : [];
    return JSON.stringify({status: {code: statusCode}, message: {short: msg[0], detail: msg[1]}, data: data});
}

function processRq(req) {

    let body = _.pick(req.body, ['code', 'name', 'description', 'isInternal']);

    if (body.code === undefined || body.code === null) {
        return new Error("Validation Error#Code Not Found");

    }
    if (body.name === undefined || body.name === null) {
        return new Error("Validation Error#Name Not Found");
    }
    if (body.isInternal === undefined || body.isInternal === null) {
        body.isInternal = false;
    }

    return body;
}


exports.customertype = functions.https.onRequest(app);
