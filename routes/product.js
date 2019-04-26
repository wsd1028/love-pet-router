var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");
var path = require("path");
var multiparty = require("multiparty")

//商品管理

//查询所有
router.get("/", async function (req, res) {
    let {
        shopId,
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
    let data = await client.get("/products", {
        submitType: "findJoin",
        ref: ["supplier", "shops"],
        page,
        rows,
        "shops.$id": shopId,
        ...option
    })
    res.send(data);
});

//查询所有供应商
router.get("/supplier", async function (req, res) {
    let data = await client.get("/supplier")
    res.send(data);
});

//统计商品销量额路由
router.get("/orders", async function (req, res) {
    let id = req.query.shopId;
    let data = await client.get("/order", {
        submitType: "findJoin",
        ref: ["shops", "products"],
        "shops.$id": id
    });
    res.send(data);
});

//根据ID查询商品
router.get("/:id", async function (req, res) {
    let id = req.params.id;
    let data = await client.get("/products/" + id, {
        submitType: "findJoin",
        ref: ["supplier", "shops"]
    });
    res.send(data);
});

//增加商品
router.post("/addPro", async function (req, res) {
    let {
        shopId,
        name,
        type,
        totalNum,
        material,
        petSize,
        petType,
        weight,
        taste,
        effect,
        country,
        date,
        freshDate,
        company,
        explain,
        price,
        image
    } = req.body;
    let data = await client.post("/products", {
        name,
        type,
        totalNum,
        material,
        petSize,
        petType,
        weight,
        taste,
        effect,
        country,
        date,
        freshDate,
        company,
        explain,
        price,
        image,
        shops: {
            $ref: "shops",
            $id: shopId
        }
    });
    res.send(data);
});

//删除商品
router.delete("/delete/:id", async function (req, res, next) {
    let id = req.params.id;
    let data = await client.delete("/products/" + id);
    res.send({
        status: 1
    });
});

//修改商品信息
router.put("/:id", async function (req, res) {
    let {
        name,
        type,
        totalNum,
        material,
        petSize,
        petType,
        weight,
        taste,
        effect,
        country,
        date,
        freshDate,
        company,
        explain,
        price,
        image
    } = req.body;
    let id = req.params.id;
    let data = await client.put("/products/" + id, {
        name,
        type,
        totalNum,
        material,
        petSize,
        petType,
        weight,
        taste,
        effect,
        country,
        date,
        freshDate,
        company,
        explain,
        price,
        image
    });
    res.send(data);
});

//上传图片
router.post('/upload', function (req, res) {
    let form = new multiparty.Form({
        uploadDir: './public/upload' //保存的路径
    });
    form.parse(req, function (err, fields, files) {
        let key = Object.keys(files)[0]; //获取上传信息中的key
        if (err) {
            res.send(err);
        } else {
            res.send(path.basename(files[key][0].path)) //根据key获取上传的文件名并返回
        }
    })
})
module.exports = router;