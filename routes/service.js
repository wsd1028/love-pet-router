var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

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

router.delete("/delete/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.delete("/serviceType/" + id);
  res.send(data);
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

router.get("/getWaiter/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.get("/shops/" + id);
  res.send(data.shopWaiter);
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
  let { name, useTtime, price,schedule,waiter,serviceTypeId,waiterLevel } = req.body;
  let id = req.params.id;
  let data = await client.put("/service/" + id, { name, useTtime, price,schedule,waiter,waiterLevel,serviceType: {
    $ref: "serviceType",
    $id: serviceTypeId
  } });
  res.send(data);
});

module.exports = router;
