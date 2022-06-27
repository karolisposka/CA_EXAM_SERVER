const express = require("express");
const cors = require("cors");
const { port } = require("./config");
const app = express();
const userRoutes = require("./Routes/v1/user");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.send({ msg: "server is running" });
});

app.get("*", (req, res) => {
  res.send({ msg: "everything ok" });
});

app.use("/v1/user/", userRoutes);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
