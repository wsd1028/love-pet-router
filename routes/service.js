var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

router.get("/counts", async function(req, res) {
  let shops = [];
  let shopSet = new Set();
  let data = await client.get("/shops");
  for (let i = 0; i < data.length; i++) {
    shopSet.add(data[i].city);
  }
  let cityArr = [...shopSet];

  for (let j = 0; j < cityArr.length; j++) {
    let cityNum = 0;
    let cityIndex = 0;
    let cityLongitude = 0;
    let cityLatitude = 0;
    for (let i = 0; i < data.length; i++) {
      if (cityArr[j] == data[i].city) {
        cityNum++;
        cityIndex = i;
      }
      if (i == data.length - 1) {
        cityLongitude = parseFloat(data[cityIndex].cityLocation.longitude);
        cityLatitude = parseFloat(data[cityIndex].cityLocation.latitude);
        shops.push([cityLongitude, cityLatitude, cityNum, cityArr[j]]);
      }
    }
  }
  res.send(shops);
});

router.get("/", async function(req, res) {
  let shops = [];
  let data = await client.get("/shops");
  for (let i = 0; i < data.length; i++) {
    shops.push([
      parseFloat(data[i].location.longitude),
      parseFloat(data[i].location.latitude),
      data[i].name,
      data[i].address
    ]);
  }
  console.log("shops", shops);
  res.send(shops);
});

//服务管理
router.get("/getServiceType", async function(req, res) {
  let { page, rows, type, value, shopId } = req.query;
  let option = {};
  if (type && value) {
    option = {
      [type]: value
    };
  }
  let data = await client.get("/serviceType", {
    page,
    rows,
    ...option,
    submitType: "findJoin",
    ref: ["shops"],
    "shops.$id": shopId
  });
  res.send(data);
});

router.delete("/delete", async function(req, res) {
  let { id, shopId } = req.body;
  let data1 = await client.get("/service", {
    submitType: "findJoin",
    ref: ["serviceType"],
    "shops.$id": shopId
  });
  for (let i = 0; i < data1.length; i++) {
    if (data1[i].serviceType._id == id) {
      await client.delete("/service/" + data1[i]._id);
    }
  }
  let data2 = await client.delete("/serviceType/" + id);
  res.send(data2);
});

router.get("/serviceType/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.get("/serviceType/" + id);
  res.send(data);
});

router.post("/add", async function(req, res) {
  let { name, time, price, shopId } = req.body;
  let data = await client.post("/serviceType", {
    name,
    time,
    price,
    shops: {
      $ref: "shops",
      $id: shopId
    }
  });
  res.send(data);
});

router.put("/updateServiceType/:id", async function(req, res) {
  let { name, time, price } = req.body;
  let id = req.params.id;
  let data = await client.put("/serviceType/" + id, { name, time, price });
  res.send(data);
});

router.get("/getServices", async function(req, res) {
  let { page, rows, type, value, shopId } = req.query;
  let option = {};
  if (type && value) {
    option = {
      [type]: value
    };
  }
  let data = await client.get("/service", {
    page,
    rows,
    ...option,
    submitType: "findJoin",
    ref: ["shops", "serviceType"],
    "shops.$id": shopId
  });
  res.send(data);
});

router.delete("/deleteServices/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.delete("/service/" + id);
  res.send(data);
});

router.post("/addServices", async function(req, res) {
  let {
    name,
    waiter,
    price,
    useTime,
    schedule,
    shopId,
    serviceTypeId
  } = req.body;
  let data = await client.post("/service", {
    name,
    waiter,
    price,
    useTime,
    schedule,
    shops: {
      $ref: "shops",
      $id: shopId
    },
    serviceType: {
      $ref: "serviceType",
      $id: serviceTypeId
    }
  });
  res.send(data);
});

router.get("/getUpdateService/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.get("/service/" + id, {
    submitType: "findJoin",
    ref: ["shops", "serviceType"]
  });
  res.send(data);
});

router.put("/updateService/:id", async function(req, res) {
  let {
    name,
    useTime,
    price,
    schedule,
    waiter,
    serviceTypeId,
    waiterLevel
  } = req.body;
  let id = req.params.id;
  let data = await client.put("/service/" + id, {
    name,
    useTime,
    price,
    schedule,
    waiter,
    waiterLevel,
    serviceType: {
      $ref: "serviceType",
      $id: serviceTypeId
    }
  });
  res.send(data);
});
router.get("/getWaiter/:id", async function(req, res) {
  let id = req.params.id;
  console.log(id);
  let data = await client.get("/shops/" + id);
  res.send(data.shopWaiter);
});
module.exports = router;
