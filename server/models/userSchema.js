const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        image: { type: String, required: true },
        email: { type: String, required: true, unique: true, },
        phoneNumber: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["Coach", "Administration", "Owner", "IT-Support", "Worker", "Client"], required: true },
        staffID: { type: String, unique: true },

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
