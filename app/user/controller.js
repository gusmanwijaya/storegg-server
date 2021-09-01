const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignIn: async (req, res) => {
    try {
      const alertStatus = req.flash("alertStatus");
      const alertMessage = req.flash("alertMessage");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/user/view_signin", { alert });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/");
    }
  },
  actionSignIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const check = await User.findOne({ email: email });

      if (check) {
        if (check.status === "Y") {
          const checkPassword = await bcrypt.compare(password, check.password);
          if (checkPassword) {
            req.session.user = {
              id: check._id,
              email: check.email,
              status: check.status,
              name: check.status,
            };
            res.redirect("/dashboard");
          } else {
            req.flash("alertStatus", "danger");
            req.flash("alertMessage", "Password Anda salah");
            res.redirect("/");
          }
        } else {
          req.flash("alertStatus", "danger");
          req.flash("alertMessage", "Mohon maaf, akun Anda belum aktif");
          res.redirect("/");
        }
      } else {
        req.flash("alertStatus", "danger");
        req.flash("alertMessage", "Email tidak terdaftar di sistem");
        res.redirect("/");
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/");
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
