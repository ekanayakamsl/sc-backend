const user = require("./user");
const menu = require("./menu");
const diningtime = require("./src/controller/diningtime");
const customerType = require("./src/controller/customertype");

exports.user = user.user;
exports.menu = menu.menu;
exports.diningtime = diningtime.diningtime;
exports.customerType = customerType.customertype;
