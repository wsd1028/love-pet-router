var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//门店管理
//查询所有的服务订单
router.get("/order", async function(req, res) {
  let shopId = req.query.shopId;
  let data = await client.get("/serviceOrder", { "shops.$id": shopId ,submitType:"findJoin",ref:["service"]});
  res.send(data);
});



//查询所有的门店
router.get("/", async function(req, res) {
  let { status, page, rows, type, value } = req.query;
  let option = {};
  if (type && value) {
    option = {
      [type]: value
    };
  }
  let data = await client.get("/shops", { status, page, rows, ...option });
  res.send(data);
});

//根据id查询门店
router.get("/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.get("/shops/" + id);
  res.send(data);
});

//修改用户集合的状态
router.put("/user/:id", async function(req, res) {
  let { status } = req.body;
  let id = req.params.id;
  let data = await client.put("/shopUsers/" + id, { status });
  res.send(data);
});

// 修改门店状态
router.put("/:id", async function(req, res) {
  let { status } = req.body;
  let id = req.params.id;
  let data = await client.put("/shops/" + id, { status });
  res.send(data);
});

//统计图路由

module.exports = router;
