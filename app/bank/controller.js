const Bank = require("./model");

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

      const bank = await Bank.find();

      res.render("admin/bank/view_bank", {
        bank,
        alert,
        name: req.session.user.name,
        title: "Bank - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      res.render("admin/bank/create", {
        name: req.session.user.name,
        title: "Tambah Bank - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, bankName, noRekening } = req.body;

      await Bank.create({ name, bankName, noRekening });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Bank berhasil ditambahkan");
      res.redirect("/bank");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });

      res.render("admin/bank/edit", {
        bank,
        name: req.session.user.name,
        title: "Ubah Bank - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, bankName, noRekening } = req.body;

      await Bank.findOneAndUpdate({ _id: id }, { name, bankName, noRekening });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Bank berhasil diubah");
      res.redirect("/bank");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Bank.findOneAndDelete({ _id: id });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Bank berhasil dihapus");
      res.redirect("/bank");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
};
