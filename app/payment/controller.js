const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
  index: async (req, res) => {
    try {
      const payment = await Payment.find().populate("banks");
      const alertStatus = req.flash("alertStatus");
      const alertMessage = req.flash("alertMessage");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      res.render("admin/payment/view_payment", { payment, alert });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/payment");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find();
      res.render("admin/payment/create", { banks });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/payment");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { type, banks } = req.body;

      await Payment.create({ type, banks });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Jenis pembayaran berhasil ditambah.");

      res.redirect("/payment");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/payment");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const banks = await Bank.find();
      const payment = await Payment.findOne({ _id: id });

      res.render("admin/payment/edit", { banks, payment });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/payment");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, banks } = req.body;

      await Payment.findOneAndUpdate({ _id: id }, { type, banks });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Jenis pembayaran berhasil diubah.");

      res.redirect("/payment");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/payment");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Payment.findOneAndDelete({ _id: id });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Jenis pembayaran berhasil dihapus.");

      res.redirect("/payment");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/payment");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({ _id: id });

      let status = `${payment.status === "Y" ? "N" : "Y"}`;

      await Payment.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertStatus", "success");
      req.flash(
        "alertMessage",
        `Status jenis pembayaran berhasil ${
          status === "Y" ? "diaktifkan" : "dinon-aktifkan"
        }`
      );

      res.redirect("/payment");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/payment");
    }
  },
};
