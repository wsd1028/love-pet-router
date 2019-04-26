var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//平台管理员登录
router.post("/", async function(req, res) {
  let { phone, pwd } = req.body;
  let data = await client.get("/sysUsers", { findType: "exact", phone, pwd });
  // console.log(data[0], "平台管理员");
  if (data[0]) {
    req.session.user = data[0];
    res.send({
      status: 1
    });
  } else {
    res.send({
      status: 0
    });
  }
});
// 门店管理员登录
router.post("/shopManagerLogin", async function(req, res) {
  let { phone, pwd } = req.body;
  let data = await client.get("/shopUsers", { findType: "exact", phone, pwd });
  if (data[0]) {
    req.session.shopManager = data[0];
    res.send(data[0]);
  } else {
    res.send();
  }
});

//门店管理员登录 --获取店家的所有信息
router.get("/shopUsers", async function(req, res) {
  let { page, rows, type, value } = req.query;
  let option = {};
  if (type && value) {
    option = { [type]: value };
  }
  let data = await client.get("/shopUsers", { page, rows, ...option });
  res.send(data);
});

//获取门店管理员session
router.get("/shopManager/getSession", function(req, res) {
  let data = req.session.shopManager;
  res.send(data || {});
});

//移除平台管理员session
router.get("/shopManager/removeSession", function(req, res) {
  req.session.user = shopManager;
  res.send({ status: 1 });
});

//店铺对应的门店管理员
router.get("/oneShop", async function(req, res) {
  let shopUserId = req.query.shopUserId;
  let data;
  if (shopUserId) {
    data = await client.get("/shops", {
      submitType: "findJoin",
      ref: ["shopUsers"],
      "shopUsers.$id": shopUserId
    });
  } else {
    data = await client.get("/shopUsers");
  }
  res.send(data);
});

//通过id 查询店铺
router.get("/shop", async function(req, res) {
  let id = req.query.id;
  let data = await client.get("/shops/" + id);
  res.send(data);
});

module.exports = router;
