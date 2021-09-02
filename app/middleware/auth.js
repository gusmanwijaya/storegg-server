const config = require("../../config");
const jwt = require("jsonwebtoken");

const Player = require("../player/model");

module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash("alertStatus", "danger");
      req.flash(
        "alertMessage",
        "Mohon maaf, kami kira Anda telah pergi, silahkan login kembali"
      );
      res.redirect("/");
    } else {
      next();
    }
  },
  isLoginPlayer: async (req, res, next) => {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null;

      const data = jwt.verify(token, config.jwtKey);

      const player = await Player.findOne({ _id: data.player._id });

      if (!player) {
        throw new Error();
      }

      req.player = player;
      req.token = token;
      next();
    } catch (error) {
      res.status(401).json({
        status: "error",
        message: "Not authorized to access this resource",
      });
    }
  },
};
