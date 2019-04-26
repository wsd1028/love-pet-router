var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
const multiparty = require("multiparty")
const path = require("path")
client.url("localhost:8080");

//门店申请
router.post("/", async function(req, res) {
  let { name,status,number,userId,city,cityLocation, image, address, location, boss, phone, headImg,feature,vipLevel,commission,shopWaiter,comment} = req.body;
  let data = await client.post("/shops", { name,status,number,userId,city,cityLocation, image, address, location, boss, phone, headImg,feature,vipLevel,commission,shopWaiter,comment} );
  res.send(data);
});

//图片上传
router.post("/upload",function(req,res){
  let form = new multiparty.Form({
    uploadDir:"./public/upload" //指定保存上传文件的路径
  });
  form.parse(req,function(err,fields,files){
    let key = Object.keys(files)[0];  //获取上传信息中的key
    if (err){
      res.send(err);
    }else{
      res.send(path.basename(files[key][0].path));  //根据key获取上传的文件名并返回
    }
  });
});

//添加绑定门店
router.put("/addShops/:id", async function(req, res) {
  let id = req.params.id;
  let {status,shopsId} = req.body
  console.log(status,shopsId)
  console.log("id",id)
  let data = await client.put("/shopUsers/" + id, {status,shops:{
    $ref:"shops",
    $id:shopsId
  }});
  res.send(data);
});

//获取session
router.get("/getSession",function(req,res){
  let data = req.session.shopManager;
  res.send(data||{});
})

// //修改用户集合的状态
// router.put("/userStatus/:id", async function(req, res) {
//   let {status} = req.body;
//   let id = req.params.userId;
//   let data = await client.put("/shopUsers/" + id, {status});
//   res.send(data);
// });
module.exports = router;
