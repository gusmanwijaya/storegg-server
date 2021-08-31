const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertStatus = req.flash("alertStatus");
      const alertMessage = req.flash("alertMessage");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      const nominal = await Nominal.find();

      res.render("admin/nominal/view_nominal", {
        nominal,
        alert,
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/nominal");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/nominal");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { coinName, coinQuantity, price } = req.body;

      await Nominal.create({ coinName, coinQuantity, price });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Nominal berhasil ditambah.");

      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/nominal");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const nominal = await Nominal.findOne({
        _id: id,
      });

      res.render("admin/nominal/edit", { nominal });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/nominal");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { coinName, coinQuantity, price } = req.body;

      await Nominal.findOneAndUpdate(
        {
          _id: id,
        },
        {
          coinName,
          coinQuantity,
          price,
        }
      );

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Nominal berhasil diubah.");

      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/nominal");
    }
  },
  actionDelete: async (req, res) => {
    const { id } = req.params;

    await Nominal.findOneAndDelete({
      _id: id,
    });

    req.flash("alertStatus", "success");
    req.flash("alertMessage", "Nominal berhasil dihapus.");

    res.redirect("/nominal");
  },
};
