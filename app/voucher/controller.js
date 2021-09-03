const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");

const path = require("path");
const fs = require("fs");
const config = require("../../config");

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

      const voucher = await Voucher.find()
        .populate("category")
        .populate("nominals");

      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
        name: req.session.user.name,
        title: "Voucher - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/voucher");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      const category = await Category.find();
      const nominal = await Nominal.find();

      res.render("admin/voucher/create", {
        category,
        nominal,
        name: req.session.user.name,
        title: "Tambah Voucher - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/voucher");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;

      if (req.file) {
        const tmp_path = req.file.path;
        const originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        const filename = req.file.filename + "." + originaExt;
        const target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            await Voucher.create({
              name,
              category,
              nominals,
              thumbnail: filename,
              user: req.session.user.id,
            });

            req.flash("alertStatus", "success");
            req.flash("alertMessage", "Voucher berhasil ditambah");

            res.redirect("/voucher");
          } catch (err) {
            req.flash("alertStatus", "danger");
            req.flash("alertMessage", `${err.message}`);
            res.redirect("/voucher");
          }
        });
      } else {
        await Voucher.create({
          name,
          category,
          nominals,
          user: req.session.user.id,
        });

        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Voucher berhasil ditambah");

        res.redirect("/voucher");
      }
    } catch (err) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${err.message}`);
      res.redirect("/voucher");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      const { id } = req.params;
      const category = await Category.find();
      const nominal = await Nominal.find();
      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals");

      res.render("admin/voucher/edit", {
        category,
        nominal,
        voucher,
        name: req.session.user.name,
        title: "Ubah Voucher - STORE GG",
        url: originalUrl[1],
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${err.message}`);
      res.redirect("/voucher");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, nominals } = req.body;

      if (req.file) {
        const tmp_path = req.file.path;
        const originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        const filename = req.file.filename + "." + originaExt;
        const target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const voucher = await Voucher.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Voucher.findOneAndUpdate(
              {
                _id: id,
              },
              {
                name,
                category,
                nominals,
                thumbnail: filename,
                user: req.session.user.id,
              }
            );

            req.flash("alertStatus", "success");
            req.flash("alertMessage", "Voucher berhasil diubah");

            res.redirect("/voucher");
          } catch (err) {
            req.flash("alertStatus", "danger");
            req.flash("alertMessage", `${err.message}`);
            res.redirect("/voucher");
          }
        });
      } else {
        await Voucher.findOneAndUpdate(
          {
            _id: id,
          },
          {
            name,
            category,
            nominals,
            user: req.session.user.id,
          }
        );

        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Voucher berhasil diubah");

        res.redirect("/voucher");
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${err.message}`);
      res.redirect("/voucher");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id });

      let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      await Voucher.findOneAndDelete({
        _id: id,
      });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Voucher berhasil dihapus");

      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${err.message}`);
      res.redirect("/voucher");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let voucher = await Voucher.findOne({ _id: id });

      let status = voucher.status === "Y" ? "N" : "Y";

      await Voucher.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertStatus", "success");
      req.flash(
        "alertMessage",
        `Status voucher berhasil ${
          status === "Y" ? "diaktifkan" : "dinon-aktifkan"
        }`
      );

      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${err.message}`);
      res.redirect("/voucher");
    }
  },
};
