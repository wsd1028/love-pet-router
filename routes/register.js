var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//验证手机号是否已注册---门店管理员
router.get("/", async function(req, res) {
  let phone = req.query.phone;
  let data = await client.get("/shopUsers", {
    phone
  });
  if (data.length > 0) {
    res.send({
      status: 0
    });
  } else {
    res.send({
      status: 1
    });
  }
});

//注册  ---门店管理员
router.post("/", async function(req, res) {
  let { phone, pwd, loginName, email, realName } = req.body;
  let data =  await client.post("/shopUsers", {
    realName,
    loginName,
    phone,
    pwd,
    email,
    realName,
    status:"null",
    shops : {
      "$ref" : "shops",
      "$id" : ""
  }
  });
//   console.log(data);
  res.send(data);
});
module.exports = router;


 
