const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

async function connection() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to db");
    } catch (err) {
        console.log("failed to connect to db!!!");
        console.log(err);
    }
}

module.exports = connection;