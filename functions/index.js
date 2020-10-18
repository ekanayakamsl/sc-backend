const user = require("./user");
const menu = require("./src/controller/menuitem");
const diningtime = require("./src/controller/diningtime");
const customerType = require("./src/controller/customertype");
const itemType = require("./src/controller/itemtype");

exports.user = user.user;
exports.menuItem = menu.menuItem;
exports.diningtime = diningtime.diningtime;
exports.customertype = customerType.customertype;
exports.itemType = itemType.itemType;
