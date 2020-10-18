const _ = require("lodash");

const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");

const conecton = require("../../initFirebase");
const admin = conecton.admin;

const app = express();

app.use(cors({origin: true}));

//Get All setup data
app.get("/maintenance-data/", async (req, res) => {
    try {
        const params = req.params;
        const codes = params.codes;

        let diningTimes = [];
        let customerTypes = [];
        let menuCategories = [];

        if (codes === undefined || codes === null || codes.includes('DINING_TIME')) {
            const snapshot = await admin.firestore().collection("diningTime").get();
            snapshot.forEach((doc) => {
                let id = doc.id;
                let data = doc.data();
                diningTimes.push({id, ...data});
            });
        }

        if (codes === undefined || codes === null || codes.includes('CUSTOMER_TYPE')) {
            const snapshot = await admin.firestore().collection("customerTypes").get();
            snapshot.forEach((doc) => {
                let id = doc.id;
                let data = doc.data();
                customerTypes.push({id, ...data});
            });
        }

        if (codes === undefined || codes === null || codes.includes('MENU_CATEGORY')) {
            const snapshot = await admin.firestore().collection("menuCategory").get();
            snapshot.forEach((doc) => {
                let id = doc.id;
                let data = doc.data();
                menuCategories.push({id, ...data});
            });
        }

        const result = {diningTimes, customerTypes, menuCategories,};

        res.status(200).send(createRes("Success", null, result));
    } catch (e) {
        console.log("Error while performing GET all Dining Time request, Error: ", e);
        res.status(500).send(createRes("Error", "Get All Dining Time Error#" + e.message));
    }
});

function createRes(statusCode, message, data) {
    const msg = message !== undefined && message !== null ? message.split("#") : [];
    return JSON.stringify({status: {code: statusCode}, message: {short: msg[0], detail: msg[1]}, data: data});
}

function processRq(req) {
    return body;
}

exports.masterData = functions.https.onRequest(app);
