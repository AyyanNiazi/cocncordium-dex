const Exchange = require("../models/exchangeModel");

exports.getExchanges = async (req, res, next) => {
  try {
    const exchanges = await Exchange.find();

    return res.status(200).json({ exchanges });
  } catch (error) {
    next(error);
  }
};

exports.saveUserExchange = async (req, res, next) => {
  try {
    const exchanges = req.body;

    const newUser = new Exchange({ exchanges });

    await newUser.save();

    res.status(201).json({ message: "User data saved successfully", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUserExchange = async (req, res, next) => {
  try {
    const exchanges = req.body;
    await Exchange.deleteMany({});

    const newUser = new Exchange({ exchanges });

    await newUser.save();

    res.status(201).json({ message: "User data saved successfully", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
