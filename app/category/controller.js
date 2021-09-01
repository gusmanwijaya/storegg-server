const Category = require("./model");

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

      const category = await Category.find();
      res.render("admin/category/view_category", {
        category,
        alert,
        name: req.session.user.name,
        title: "Kategori - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);

      res.redirect("/category");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      res.render("admin/category/create", {
        name: req.session.user.name,
        title: "Tambah Kategori - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);

      res.redirect("/category");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;

      const category = await Category({ name });
      await category.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Kategori berhasil ditambah.");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);

      res.redirect("/category");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      const { id } = req.params;
      const category = await Category.findOne({
        _id: id,
      });

      res.render("admin/category/edit", {
        category,
        name: req.session.user.name,
        title: "Ubah Kategori - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);

      res.redirect("/category");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await Category.findOneAndUpdate(
        {
          _id: id,
        },
        {
          name,
        }
      );

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Kategori berhasil diubah.");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);

      res.redirect("/category");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Category.findOneAndDelete({
        _id: id,
      });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Kategori berhasil dihapus.");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);

      res.redirect("/category");
    }
  },
};
