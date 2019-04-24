var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

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

    let data = await client.get("/users", {
        page,
        rows,
        ...option
    });
    res.send(data);
});
//根据id查询
router.get("/:id", async function (req, res) {
    let id = req.params.id;

    let data = await client.get("/users/" + id);
    res.send(data);
});

router.put("/:id", async function (req, res) {
    let {
       
       state
    } = req.body;


    // let pet = JSON.parse(req.body.pet);
    let id = req.params.id;
    let data = await client.put("/users/" + id, {
       state
    });

    res.send(data);

});
module.exports = router;