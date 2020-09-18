const user = require("./user");
const menu = require("./menu");
const diningtime = require("./diningtime");

exports.user = user.user;
exports.menu = menu.menu;
exports.diningtime = diningtime.diningtime;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });
