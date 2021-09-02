const express = require("express");
const router = express.Router();

const multer = require("multer");
const os = require("os");

const { signUp } = require("./controller");

router.post(
  "/signup",
  multer({
    dest: os.tmpdir(),
  }).single("avatar"),
  signUp
);

module.exports = router;
