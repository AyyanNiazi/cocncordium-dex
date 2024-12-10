const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema({
  email: String,
  username: String,
  walletAddress: String,
});

const FormSubmission = mongoose.model("FormSubmission", formSubmissionSchema);

module.exports = FormSubmission;
