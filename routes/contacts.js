var models  = require('../models');
var express = require('express');
var router  = express.Router();
    // start=int(request.GET.get("start","0"))
    // limit=int(request.GET.get("limit","5"))
    // search=request.GET.get("search",'')
    // baoxiang=request.GET.get("baoxiang",'')
    // logging.info("search="+search)
    // logging.info("baoxiang="+baoxiang)
    // if search!='':
    //     if baoxiang!="":
    //         total=Contact.objects.filter(Q(hetongbh__icontains=search) | Q(yiqibh__icontains=search) & Q(baoxiang=baoxiang)).count()
    //         objs = Contact.objects.filter(Q(hetongbh__icontains=search) | Q(yiqibh__icontains=search)).order_by('-yujifahuo_date')[start:start+limit]
    //     else:
    //         total=Contact.objects.filter(Q(hetongbh__icontains=search) | Q(yiqibh__icontains=search)).count()
    //         objs = Contact.objects.filter(Q(hetongbh__icontains=search) | Q(yiqibh__icontains=search)).order_by('-yujifahuo_date')[start:start+limit]
    // else:
    //     if baoxiang!="":
    //         total=Contact.objects.filter(Q(baoxiang=baoxiang)).count()
    //         objs = Contact.objects.filter(Q(baoxiang=baoxiang)).order_by('-yujifahuo_date')[start:start+limit]
    //     else:
    //         total=Contact.objects.count()
    //         objs = Contact.objects.order_by('-yujifahuo_date')[start:start+limit]
router.get('/', function(req, res) {
  console.log(req.query);
  var start=req.query.start;
  var limit=req.query.limit;
  var search=req.query.search;
  var baoxiang='';
  if (req.query.baoxiang){
    baoxiang=req.query.baoxiang;
  }
  var w=null;
  if (search!=""){
      if(baoxiang!=""){
          w={
            $or:{
              yiqibh:{$like:"%"+search+"%"},
              hetongbh:{$like:"%"+search+"%"},
            },
            baoxiang:{$like:"%"+baoxiang+"%"}
          };
      }
      else{
          w={
            $or:{
              yiqibh:{$like:"%"+search+"%"},
              hetongbh:{$like:"%"+search+"%"},
            }
          };
      }
  }
  else
  {
      if(baoxiang!=""){
          w={
            baoxiang:{$like:"%"+baoxiang+"%"}
          };
      }
      else{
        w={};
      }
  }
  console.log(w);
  //console.log(models.sequelize);
  models.Contact.findAll({
    attributes: [ [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'total'], ],
    where: w
  }).then(function(datas){//dataValues
      var total=datas[0].dataValues.total;
      console.log("total="+total);
      models.Contact.findAll({
        where: w,limit: limit,offset:start,order:'yujifahuo_date DESC'
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
});
router.post('/create', function(req, res) {
  models.Contact.create({
    yonghu: req.body.yonghu
  }).then(function() {
    res.redirect('/parts');
  });
});

router.get('/:contact_id/destroy', function(req, res) {
  models.Contact.destroy({
    where: {
      id: req.params.contact_id
    }
  }).then(function() {
    res.redirect('/parts');
  });
});

router.post('/:contact_id/tasks/create', function (req, res) {
  models.Task.create({
    title: req.body.title,
    ContactId: req.params.contact_id
  }).then(function() {
    res.redirect('/parts');
  });
});

router.get('/:contact_id/tasks/:task_id/destroy', function (req, res) {
  models.Task.destroy({
    where: {
      id: req.params.task_id
    }
  }).then(function() {
    res.redirect('/parts');
  });
});


module.exports = router;
