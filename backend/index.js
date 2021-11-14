const express = require("express");
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const pinRoute = require("./routes/pins")
const userRoute = require("./routes/users")
const app = express()
dotenv.config();

app.use(express.json())
app.use("/api/pins", pinRoute)
app.use("/api/users", userRoute)

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("sucessfully connected to DB"))
.catch(err => console.log(err))

app.listen(8800, () => console.log("Server is running on port 8800"))