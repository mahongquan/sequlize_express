var models  = require('../models');
//var express = require('express');
var router  = require('express').Router();
router.get('/', function(req, res) {
  console.log("get packitem");
  console.log(req.query);
  var pack_id=req.query.pack_id;
  var start=req.query.start;
  var limit=req.query.limit;
  if(pack_id!=undefined && pack_id!="")
   {
        w={
            pack_id:pack_id
          };
  }
  else{  
      w={};
    }
    console.log(w);
models.PackItem.findAll({
    attributes: [ [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'total'], ],
    where: w
  }).then(function(datas){//dataValues
      var total=datas[0].dataValues.total;
      console.log("total="+total);          
      models.PackItem.findAll({
        where: w,limit: limit,offset:start,
         include: [{
                  model: models.Item,
             }] ,
      }
      ).then(function(contacts) {
        if(contacts.length>0){
          res.json({data:contacts,total:total});
        }
        else{
          res.json({data:contacts,total:0}); 
        }
      });//then
  });//then
  });//query
router.post('/', function(req, res) {
  models.Item.create({
    yonghu: req.body.yonghu
  }).then(function() {
    res.redirect('/parts');
  });
});//create

router.put('/', function(req, res) {
  models.Item.destroy({
    where: {
      id: req.params.contact_id
    }
  }).then(function() {
    res.redirect('/parts');
  });
});//update

router.delete('/', function (req, res) {
  models.Task.create({
    title: req.body.title,
    ContactId: req.params.contact_id
  }).then(function() {
    res.redirect('/parts');
  });
});//delete

module.exports = router;

