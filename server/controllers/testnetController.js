const FormSubmission = require("../models/formSubmission");

exports.submitForm = async (req, res) => {
  const { email, username, walletAddress } = req.body;

  const formSubmission = new FormSubmission({
    email,
    username,
    walletAddress,
  });

  try {
    await formSubmission.save();
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await FormSubmission.findOne({ username });

    if (user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
