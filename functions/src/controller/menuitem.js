const _ = require("lodash");

const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");

const conecton = require("../../initFirebase");
const admin = conecton.admin;

const app = express();

app.use(cors({origin: true}));

//Get All Menu Items
app.get("/", async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection("menuItem").get();

        let menuItems = [];
        snapshot.forEach((doc) => {
            let id = doc.id;
            let data = doc.data();
            menuItems.push({id, ...data});
        });

        res.status(200).send(createRes("Success", null, menuItems));
    } catch (e) {
        console.log("Error while performing GET all Menu Item request, Error: ", e);
        res.status(500).send(createRes("Error", "Get All Menu Item Error#" + e.message));
    }
});

app.get("/:code", async (req, res) => {
    try {
        const params = req.params;
        const docRef = admin.firestore().collection("menuItem");

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
        console.log("Error while performing GET Menu Item by code request, Error: ", e);
        res.status(500).send(createRes("Error", "Get Menu Item Error#" + e.message));
    }
});

app.post("/", async (req, res) => {
    try {
        const body = processRq(req);
        if (body instanceof Error) {
            res.status(400).send(createRes("Error", body.message, null));
            return;
        }

        const docRef = admin.firestore().collection("menuItem");
        const exist = await docRef.doc(body.code).get().then((docSnapshot) => {
            return docSnapshot.exists;
        });

        if (exist) {
            res.status(400).send(createRes("Error", "Error while create Menu Item#Menu Item " + body.code + " already exist", null));
        } else {
            await docRef.doc(body.code).set(body);
            res.status(201).send(createRes("Success", "Success fully created" + "#" + body.code + " Menu Item created successfully", null));
        }
    } catch (e) {
        console.log("Error while performing Create Menu Item request, Error: ", e);
        res.status(500).send(createRes("Error", "Create Menu Item Error#" + e.message));
    }
});

app.put("/:code", async (req, res) => {
    try {
        const params = req.params;
        const body = processRq(req);
        if (body instanceof Error) {
            res.status(400).send(createRes("Error", body.message, null));
            return;
        }

        const docRef = admin.firestore().collection("menuItem");
        const exist = await docRef.doc(params.code).get().then((docSnapshot) => {
            return docSnapshot.exists;
        });

        if (exist) {
            await docRef.doc(params.code).update(body);
            res.status(200).send(createRes("Success", "Success fully updated" + "#" + params.code + " Menu Item updated successfully", null));
        } else {
            res.status(400).send(createRes("Error", "Error while update Menu Item#Menu Item + " + params.code + " not found", null));
        }
    } catch (e) {
        console.log("Error while performing Update Menu Item request, Error: ", e);
        res.status(500).send(createRes("Error", "Update Menu Item Error#" + e.message));
    }
});

app.delete("/:code", async (req, res) => {
    try {
        const params = req.params;

        const docRef = admin.firestore().collection("menuItem");
        const exist = await docRef.doc(params.code).get().then((docSnapshot) => {
            return docSnapshot.exists;
        });

        if (exist) {
            await docRef.doc(params.code).delete();
            res.status(200).send(createRes("Success", "Success fully deleted" + "#" + params.code + " Menu Item deleted successfully", null));
        } else {
            res.status(400).send(createRes("Error", "Error while delete Menu Item#Menu Item + " + params.code + " not found", null));
        }
    } catch (e) {
        console.log("Error while performing Update Menu Item request, Error: ", e);
        res.status(500).send(createRes("Error", "Update Menu Item Error#" + e.message));
    }
});

function createRes(statusCode, message, data) {
    const msg = message !== undefined && message !== null ? message.split("#") : [];
    return JSON.stringify({status: {code: statusCode}, message: {short: msg[0], detail: msg[1]}, data: data});
}

function processRq(req) {

    let body = _.pick(req.body, ['code', 'name', 'description', 'imageUrl', 'isAllDiningTimes', 'diningTimes', 'isAllCustomerTypes', 'customerTypes', 'isActive']);

    if (body.code === undefined || body.code === null) {
        return new Error("Validation Error#Code Not Found");
    }
    if (body.name === undefined || body.name === null) {
        return new Error("Validation Error#Name Not Found");
    }
    if (body.isAllDiningTimes === undefined || body.isAllDiningTimes === null) {
        body.isAllDiningTimes = false;
    }
    if (body.isAllDiningTimes && (body.diningTimes === undefined || body.diningTimes === null || body.diningTimes.length < 1)) {
        return new Error("Validation Error#Dining Times Not Found");
    }
    if (body.isAllCustomerTypes === undefined || body.isAllCustomerTypes === null) {
        body.isAllCustomerTypes = false;
    }
    if (body.isAllCustomerTypes && (body.customerTypes === undefined || body.customerTypes === null || body.customerTypes.length < 1)) {
        return new Error("Validation Error#Customer Types Not Found");
    }
    if (body.isActive === undefined || body.isActive === null) {
        body.isActive = false;
    }

    return body;
}


exports.menuItem = functions.https.onRequest(app);
