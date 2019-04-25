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
        ...option
    })
    // console.log(data)

    res.send(data);
});

//查询所有供应商
router.get("/supplier", async function (req, res) {
    let data = await client.get("/supplier")
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
    console.log(id)
    let {
        id,
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
            $id: id
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
    // console.log(1)
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

//统计商品销量额路由
router.get("/getTradeNum", async function (req, res) {
    let id = "5cbd2530b261c595a225003b";
    let data = await client.get("/order", {
        submitType: "findJoin",
        ref: ["shops", "products"],
        "shops.$id": id
    });
    let TradeNameArr = [];
    let arr = [{
            month: "1月",
            product: []
        },
        {
            month: "2月",
            product: []
        },
        {
            month: "3月",
            product: []
        },
        {
            month: "4月",
            product: []
        },
        {
            month: "5月",
            product: []
        },
        {
            month: "6月",
            product: []
        },
        {
            month: "7月",
            product: []
        },
        {
            month: "8月",
            product: []
        },
        {
            month: "9月",
            product: []
        },
        {
            month: "10月",
            product: []
        },
        {
            month: "11月",
            product: []
        },
        {
            month: "12月",
            product: []
        }
    ];
    for (let i = 0; i < data.length; i++) {
        TradeNameArr.push(data[i].products.name);
    }
    let newTradeNameArr = [...new Set(TradeNameArr)];
    for (let i = 0; i < newTradeNameArr.length; i++) {
        let number = 0;
        let number1 = 0;
        let number2 = 0;
        let number3 = 0;
        let number4 = 0;
        let number5 = 0;
        let number6 = 0;
        let number7 = 0;
        let number8 = 0;
        let number9 = 0;
        let number10 = 0;
        let number11 = 0;
        for (let j = 0; j < data.length; j++) {
            let month = parseInt(data[j].date.split("年")[1].split("月")[0]);
            if (data[j].products.name == newTradeNameArr[i]) {
                switch (month) {
                    case 1:
                        number += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 2:
                        number1 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 3:
                        number2 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 4:
                        number3 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 5:
                        number4 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 6:
                        number5 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 7:
                        number6 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 8:
                        number7 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 9:
                        number8 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 10:
                        number9 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 11:
                        number10 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                    case 12:
                        number11 += parseInt(data[j].number) * parseInt(data[j].products.price);
                        break;
                }
                //   switch (month) {
                //     case 1:
                //       number += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 2:
                //       number1 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 3:
                //       number2 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 4:
                //       number3 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 5:
                //       number4 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 6:
                //       number5 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 7:
                //       number6 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 8:
                //       number7 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 9:
                //       number8 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 10:
                //       number9 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 11:
                //       number10 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //     case 12:
                //       number11 += parseInt(data[j].number)*parseInt(data[j].products.price);
                //       break;
                //   }
            }
        }
        arr[0].product.push({
            name: newTradeNameArr[i],
            number
        });
        arr[1].product.push({
            name: newTradeNameArr[i],
            number: number1
        });
        arr[2].product.push({
            name: newTradeNameArr[i],
            number: number2
        });
        arr[3].product.push({
            name: newTradeNameArr[i],
            number: number3
        });
        arr[4].product.push({
            name: newTradeNameArr[i],
            number: number4
        });
        arr[5].product.push({
            name: newTradeNameArr[i],
            number: number5
        });
        arr[6].product.push({
            name: newTradeNameArr[i],
            number: number6
        });
        arr[7].product.push({
            name: newTradeNameArr[i],
            number: number7
        });
        arr[8].product.push({
            name: newTradeNameArr[i],
            number: number8
        });
        arr[9].product.push({
            name: newTradeNameArr[i],
            number: number9
        });
        arr[10].product.push({
            name: newTradeNameArr[i],
            number: number10
        });
        arr[11].product.push({
            name: newTradeNameArr[i],
            number: number11
        });
    }
    console.log(arr)
    res.send(arr);

});

module.exports = router;