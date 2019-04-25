var express = require('express');
var router = express.Router();
const db = require("ykt-mongo");
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");

router.get("/",async function(req,res){
    let {page,rows,type,value} = req.query;
    let searchObj = {};
    if(type){
        searchObj = {[type]:value};
    }
    let data = await client.get("/students",{page,rows,submitType:"findJoin",ref:"classes",...searchObj});
    res.send(data);
});

//统计各个年龄段的人数
router.get('/ageTotal',async function(req,res){
    let data = await client.get("/students");
    let axisData = ["18岁以下","18到30岁","30岁以上"];
    let seriesData = [{name:"18岁以下",value:0},{name:"18到30岁",value:0},{name:"30岁以上",value:0}];
    data.forEach(function(ele){
        if(ele.age < 18){
            seriesData[0].value++;
        }
        else if(ele.age >= 18 && ele.age <= 30){
            seriesData[1].value++;
        }else{
            seriesData[2].value++;
        }
    });
    res.send({axisData,seriesData});
});

router.get("/:id",async function(req,res){
    let id = req.params.id;
    let data = await client.get("/students/"+id);
    res.send(data);
    
});

router.post("/",async function(req,res){
    let {name,gender,age,classId} = req.body;
    await client.post("/students",{name,gender,age,classes:{
        $id:classId,
        $ref:"classes"
    }});
    let classesData = await client.get("/classes/"+classId);
    classesData.count++;
    delete classesData._id;
    await client.put("/classes/"+classId,{...classesData});
    res.send({status:1});
});

router.put("/:id",async function(req,res){
    let id = req.params.id;
    let {name,gender,age,classId} = req.body;
    await client.put("/students/"+id,{name,gender,age,classes:{
        $ref:"classes",
        $id:classId
       
    }});
    res.send({status:1});
    
});
router.delete("/:id",async function(req,res){
    let id = req.params.id;
    await client.delete("/students/"+id);
    res.send({status:1});
});



module.exports = router;