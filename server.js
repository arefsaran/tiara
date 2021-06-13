const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");
const { User } = require("./models/user");
const path = require("path");
const { PORT, HOST, MONGO_DB } = require("./config/config");
// const { MongoClient } = require("mongodb");

app.use((req, res, next) => {
    res.setHeader("Access-control-Allow-Origin", "*");
    res.setHeader("Access-control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Autherization, X-Subdomain"
    );
    res.setHeader("Access-Control-Expose-Headers", "*");
    next();
});
app.set("view engine", "ejs");
app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "views/shop/"),
    path.join(__dirname, "views/admin/"),
    path.join(__dirname, "views/user/"),
]);

app.use(express.static("static"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);
let CronJob = require("cron").CronJob;
let job = new CronJob(
    "30 11 * * *",
    function () {
        // console.log("You will see this message every second");
        User.updateMany(
            { "userStore.storePlan.planTimeToExpiry": { $gte: 1 } },
            { $inc: { "userStore.storePlan.planTimeToExpiry": -1 } },
            (err, writeResult) => {}
        );
    },
    null,
    true,
    "America/Los_Angeles"
);
job.start();
mongoose
    .connect(MONGO_DB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("connected to MongoDB/mongoose"))
    .catch((err) => console.log("could not connect to MongoDB", err));
mongoose.set("useCreateIndex", true);
// MongoClient.connect(
//     "mongodb://localhost:27017/ecommerce",
//     { useUnifiedTopology: true },
//     function (err, db) {
//         if (err) throw err;
//         console.log("connected to MongoDB");
//         //Write databse Insert/Update/Query code here..
//     }
// );
const server = app.listen(PORT, HOST, function () {
    let HOST = server.address().address;
    let PORT = server.address().port;

    console.log("Server Running On: http://%s:%s", HOST, PORT);
});

module.exports = mongoose.connection;
