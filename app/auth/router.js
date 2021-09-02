const express = require("express");
const router = express.Router();

const multer = require("multer");
const os = require("os");

const { signUp, signIn } = require("./controller");

router.post(
  "/signup",
  multer({
    dest: os.tmpdir(),
  }).single("avatar"),
  signUp
);
router.post("/signin", signIn);

module.exports = router;
