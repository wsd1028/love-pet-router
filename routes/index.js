var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//获取平台管理员session
router.get("/getSession", function(req, res) {
  console.log("session 中的data");
  let data = req.session.user;
  res.send(data || {});
});

//移除平台管理员session
router.get("/removeSession", function(req, res) {
  req.session.user = null;
  res.send({ status: 1 });
});
module.exports = router;
