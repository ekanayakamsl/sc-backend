const user = require("./user");
const menu = require("./src/controller/menuitem");
const diningtime = require("./src/controller/diningtime");
const customerType = require("./src/controller/customertype");
const menuCategory = require("./src/controller/menuCategory");
const masterData = require("./src/controller/masterData");

exports.user = user.user;
exports.menuItem = menu.menuItem;
exports.diningtime = diningtime.diningtime;
exports.customertype = customerType.customertype;
exports.menuCategory = menuCategory.menuCategory;
exports.masterData = masterData.masterData;
