var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//获取全部数据
router.get("/", async function(req, res) {
  let { page, rows, type, value } = req.query;
  let option = {};
  if (type && value) {
    option = { [type]: value };
  }
  let data = await client.get("/shopUsers", { page, rows, ...option });
  res.send(data);
});

//获取一条门店管理员数据
router.get("/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.get("/shopUsers/" + id);
  res.send(data);
});

//修改门店管理员
router.put("/:id", async function(req, res) {
  let { name, phone, pwd } = req.body;
  let id = req.params.id;
  let data = await client.put("/shopUsers/" + id, { name, phone, pwd });
  res.send(data);
});

//删除门店管理员
router.delete("/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.delete("/shopUsers/" + id);
  res.send(data);
});
//门店管理员对应的店铺状态
router.get("/oneShopManager", async function(req, res) {
  // console.log(req.query);
  let shopManagerId = req.query.shopManagerId;
  let data;
  if (shopManagerId) {
    data = await client.get("/shopUsers", {
      submitType: "findJoin",
      ref: ["shops"],
      "shops.$id": shopManagerId
    });
  } else {
    data = await client.get("/shops");
  }
  // console.log(data);
  res.send(data);
});

module.exports = router;
