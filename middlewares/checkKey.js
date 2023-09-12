const { ApiKeys } = require("../models/model");
const apiKeyValidation = async (req, res, next) => {
  try {
    let key = req.params.key;
    let check = await ApiKeys.findOne({ key: key });
    check ? next() : res.status(400).json({Error: "Invalid Key"})
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

module.exports = apiKeyValidation;
