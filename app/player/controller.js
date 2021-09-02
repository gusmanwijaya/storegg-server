const Player = require("./model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select("_id name status category thumbnail")
        .populate("category");

      res.status(200).json({
        data: voucher,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");

      if (!voucher) {
        return res.status(404).json({
          status: "error",
          message: "Voucher game tidak ditemukan",
        });
      }

      res.status(200).json({
        data: voucher,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();

      res.status(200).json({ data: category });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  },
};
