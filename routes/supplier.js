var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");
var path =require("path");
const multiparty =require("multiparty")

//供应商管理
router.get("/", async function (req, res) {
  let {
    page,
    rows,
    type,
    value
  } = req.query;
  let option = {};
  if (type && value) {
    option = {
      [type]: value
    }
  }
  let data = await client.get("/supplier", {
    page,
    rows,
    ...option
  });
  res.send(data);
});

//根据ID查询用户
router.get("/:id", async function (req, res) {
  let id = req.params.id;
  let data = await client.get("/supplier/" + id);
  res.send(data);
});
//增加供应商
router.post("/addSuppliers", async function (req, res) {
  let {
    name,
    phone,
    adress,
    people,
    img
  } = req.body;
  let data = await client.post("/supplier", {
    name,
    phone,
    adress,
    people,
    img
  });
  res.send(data);
});
//修改供应商
router.put("/:id", async function (req, res) {
  let {
    name,
    phone,
    adress,
    people,
    img
  } = req.body;
  let id = req.params.id;
  let data = await client.put("/supplier/" + id, {
    name,
    phone,
    adress,
    people,
    img
  });
  res.send(data);
});
//营业执照
router.post("/upload", function (req, res) {
  let form = new multiparty.Form({
    uploadDir: './public/upload'
  });
  form.parse(req, function (err, fields, files) {
    let key = Object.keys(files)[0]; //获取上传信息的key
    if (err) {
      res.send(err);
    } else {
      res.send(path.basename(files[key][0].path))
    }
  })
});
//删除供应商
router.delete("/delete/:id", async function (req, res) {
  let id = req.params.id;
  let data = await client.delete("/supplier/" + id);
  res.send(data);
});
module.exports = router;