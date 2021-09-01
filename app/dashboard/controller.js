const Transaction = require("../transaction/model");
const Voucher = require("../voucher/model");
const Player = require("../player/model");
const Category = require("../category/model");

module.exports = {
  index: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      const transaction = await Transaction.countDocuments();
      const voucher = await Voucher.countDocuments();
      const player = await Player.countDocuments();
      const category = await Category.countDocuments();

      res.render("admin/dashboard/view_dashboard", {
        name: req.session.user.name,
        url: originalUrl[1],
        title: "Dashboard - STORE GG",
        count: {
          alert,
          transaction,
          voucher,
          player,
          category,
        },
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/dashboard");
    }
  },
};
