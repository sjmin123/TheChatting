// db.js
import { mongoose } from "mongoose";

import connection from './connection.json' assert { type: 'json' }

const uri = connection.mongoURL;

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDB;