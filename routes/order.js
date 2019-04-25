var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//订单管理
//查询所有商品订单
router.get("/commodity", async function(req, res) {
  let { page, rows, type, value } = req.query;
  let trade = req.query.trade;
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
        rows
      });
      res.send(data);
    } else {
      let data = await client.get("/order", {
        submitType: "findJoin",
        ref: ["shops", "users", "products"],
        page,
        rows,
        ...option,
        status: "1"
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
        status: "0"
      });
      let data2 = await client.get("/order", {
        submitType: "findJoin",
        ref: ["shops", "users", "products"],
        page,
        rows,
        ...option,
        status: "2"
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
        status: "1"
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
        status: "1"
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
        status: "1"
      });
      res.send(data);
    }
  } else {
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
        status: "0"
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
        status: "0"
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
        status: "0"
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
  let id = "5cbae16ce0d4c6dae46facd4";
  let data = await client.get("/order", {
    submitType: "findJoin",
    ref: ["shops"],
    "shops.$id": id
  });
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    let date = data[0].date;
    let month = parseInt(date.split("年")[1].split("月")[0]);
    switch (month) {
      case (month = 1):

      case (month = 2):

      case (month = 3):

      case (month = 4):

      case (month = 5):

      case (month = 6):

      case (month = 7):

      case (month = 8):

      case (month = 9):

      case (month = 10):

      case (month = 11):

      case (month = 12):
        break;
    }
  }
  res.send(data);
});

//统计店铺服务销量

module.exports = router;
