const Transaction = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      const alertStatus = req.flash("alertStatus");
      const alertMessage = req.flash("alertMessage");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      const transaction = await Transaction.find().populate("player");

      res.render("admin/transaction/view_transaction", {
        alert,
        transaction,
        name: req.session.user.name,
        title: "Transaksi - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/transaction");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;

      await Transaction.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertStatus", "success");
      req.flash(
        "alertMessage",
        `Transaksi berhasil di${status === "success" ? "terima" : "tolak"}`
      );
      res.redirect("/transaction");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/transaction");
    }
  },
};
