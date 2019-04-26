var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//订单管理
//查询所有商品订单
router.get("/commodity", async function(req, res) {
  let { page, rows, type, value } = req.query;
  let trade = req.query.trade;
  let id = req.query.id;
  let option = {};
  if (type && value) {
    option = {
      [type]: value
    };
  }
  if (trade == "sent") {
    if (type == "$id") {
      let data = await client.get("/order/" + value, {
        submitType: "findJoin",
        ref: ["shops", "users", "products"],
        page,
        rows,
        "shops.$id": id
      });
      res.send(data);
    } else {
      let data = await client.get("/order", {
        submitType: "findJoin",
        ref: ["shops", "users", "products"],
        page,
        rows,
        ...option,
        status: "1",
        "shops.$id": id
      });
      res.send(data);
    }
  } else {
    if (type == "$id") {
      let data = await client.get("/order/" + value, {
        submitType: "findJoin",
        ref: ["shops", "users", "products"],
        page,
        rows
      });
      res.send(data);
    } else {
      data1 = {};
      let data = await client.get("/order", {
        submitType: "findJoin",
        ref: ["shops", "users", "products"],
        page,
        rows,
        ...option,
        status: "0",
        "shops.$id": id
      });
      let data2 = await client.get("/order", {
        submitType: "findJoin",
        ref: ["shops", "users", "products"],
        page,
        rows,
        ...option,
        status: "2",
        "shops.$id": id
      });
      data1.curpage = parseInt(page);
      data1.eachpage = parseInt(rows);
      data1.total = data.total + data2.total;
      data1.rows = [...data.rows, ...data2.rows];
      res.send(data1);
    }
  }
});

// 修改商品状态
router.put("/commodity/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.put("/order/" + id, { status: "2" });
  res.send(data);
});

//查询所有服务订单
router.get("/serve", async function(req, res) {
  let { page, rows, type, value } = req.query;
  let serve = req.query.serve;
  let id = req.query.id;
  let option = {};
  let data1 = {};
  if (type && value) {
    option = {
      [type]: value
    };
  }
  if (serve == "completed") {
    if (type == "$id") {
      let data = await client.get("/serviceOrder/" + value, {
        submitType: "findJoin",
        ref: ["shops", "users", "service"],
        page,
        rows
      });
      res.send(data);
    } else if (type == "name") {
      data1 = {};
      let data = await client.get("/serviceOrder", {
        submitType: "findJoin",
        ref: ["shops", "users", "service"],
        status: "1",
        "shops.$id": id
      });
      let i = 0;
      data1.curpage = parseInt(page);
      data1.eachpage = parseInt(rows);
      data1.rows = [];
      for (i; i < data.length; i++) {
        if (
          (parseInt(page) - 1) * parseInt(rows) <= i &&
          i < parseInt(page) * parseInt(rows) &&
          data[i].users.name == value
        ) {
          data1.rows.push(data[i]);
        }
      }
      data1.total = i;
      res.send(data1);
    } else if (type == "phone") {
      data1 = {};
      let data = await client.get("/serviceOrder", {
        submitType: "findJoin",
        ref: ["shops", "users", "service"],
        status: "1",
        "shops.$id": id
      });
      let i = 0;
      data1.curpage = parseInt(page);
      data1.eachpage = parseInt(rows);
      data1.rows = [];
      for (i; i < data.length; i++) {
        if (
          (parseInt(page) - 1) * parseInt(rows) <= i &&
          i < parseInt(page) * parseInt(rows) &&
          data[i].users.phone == value
        ) {
          data1.rows.push(data[i]);
        }
      }
      data1.total = i;
      res.send(data1);
    } else {
      let data = await client.get("/serviceOrder", {
        submitType: "findJoin",
        ref: ["shops", "users", "service"],
        page,
        rows,
        ...option,
        status: "1",
        "shops.$id": id
      });
      res.send(data);
    }
  } else {
    if (type == "$id") {
      let data = await client.get("/serviceOrder/" + value, {
        submitType: "findJoin",
        ref: ["shops", "users", "service"],
        page,
        rows,
        "shops.$id": id
      });
      res.send(data);
    } else if (type == "name") {
      data1 = {};
      let data = await client.get("/serviceOrder", {
        submitType: "findJoin",
        ref: ["shops", "users", "service"],
        status: "0",
        "shops.$id": id
      });
      let i = 0;
      data1.curpage = parseInt(page);
      data1.eachpage = parseInt(rows);
      data1.rows = [];
      for (i; i < data.length; i++) {
        if (
          (parseInt(page) - 1) * parseInt(rows) <= i &&
          i < parseInt(page) * parseInt(rows) &&
          data[i].users.name == value
        ) {
          data1.rows.push(data[i]);
        }
      }
      data1.total = i;
      res.send(data1);
    } else if (type == "phone") {
      data1 = {};
      let data = await client.get("/serviceOrder", {
        submitType: "findJoin",
        ref: ["shops", "users", "service"],
        status: "0",
        "shops.$id": id
      });
      let i = 0;
      data1.curpage = parseInt(page);
      data1.eachpage = parseInt(rows);
      data1.rows = [];
      for (i; i < data.length; i++) {
        if (
          (parseInt(page) - 1) * parseInt(rows) <= i &&
          i < parseInt(page) * parseInt(rows) &&
          data[i].users.phone == value
        ) {
          data1.rows.push(data[i]);
        }
      }
      data1.total = i;
      res.send(data1);
    } else {
      let data = await client.get("/serviceOrder", {
        submitType: "findJoin",
        ref: ["shops", "users", "service"],
        page,
        rows,
        ...option,
        status: "0",
        "shops.$id": id
      });
      res.send(data);
    }
  }
});

// 修改服务状态
router.put("/serve/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.put("/serviceOrder/" + id, { status: "1" });
  res.send(data);
});

//统计店铺商品销量
router.get("/getTradeNum", async function(req, res) {
  let id = req.query.id;
  let data = await client.get("/order", {
    submitType: "findJoin",
    ref: ["shops", "products"],
    "shops.$id": id
  });
  let TradeNameArr = [];
  let arr = [
    {
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
            number += parseInt(data[j].number);
            break;
          case 2:
            number1 += parseInt(data[j].number);
            break;
          case 3:
            number2 += parseInt(data[j].number);
            break;
          case 4:
            number3 += parseInt(data[j].number);
            break;
          case 5:
            number4 += parseInt(data[j].number);
            break;
          case 6:
            number5 += parseInt(data[j].number);
            break;
          case 7:
            number6 += parseInt(data[j].number);
            break;
          case 8:
            number7 += parseInt(data[j].number);
            break;
          case 9:
            number8 += parseInt(data[j].number);
            break;
          case 10:
            number9 += parseInt(data[j].number);
            break;
          case 11:
            number10 += parseInt(data[j].number);
            break;
          case 12:
            number11 += parseInt(data[j].number);
            break;
        }
      }
    }
    arr[0].product.push({ name: newTradeNameArr[i], number });
    arr[1].product.push({ name: newTradeNameArr[i], number: number1 });
    arr[2].product.push({ name: newTradeNameArr[i], number: number2 });
    arr[3].product.push({ name: newTradeNameArr[i], number: number3 });
    arr[4].product.push({ name: newTradeNameArr[i], number: number4 });
    arr[5].product.push({ name: newTradeNameArr[i], number: number5 });
    arr[6].product.push({ name: newTradeNameArr[i], number: number6 });
    arr[7].product.push({ name: newTradeNameArr[i], number: number7 });
    arr[8].product.push({ name: newTradeNameArr[i], number: number8 });
    arr[9].product.push({ name: newTradeNameArr[i], number: number9 });
    arr[10].product.push({ name: newTradeNameArr[i], number: number10 });
    arr[11].product.push({ name: newTradeNameArr[i], number: number11 });
  }
  res.send(arr);
});

//统计店铺服务销量

module.exports = router;
