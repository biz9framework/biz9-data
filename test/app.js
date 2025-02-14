express=require("express");

const index=require("./");

app = express();
app.use(express.json());
app.use("/",index);

module.exports = app;
