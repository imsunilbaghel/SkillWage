import mongoose from "mongoose";

//MongoDB Connection

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "skillwage",
    });

    console.log(
      `\MongoDB Connected | Host: ${connectionInstance.connection.host} | DB: ${connectionInstance.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB Connection FAILED:", error.message);
    process.exit(1);
  }
};

//Connection Event Listeners
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to database");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from database");
});

export default connectDB;
