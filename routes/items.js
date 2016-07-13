var models  = require('../models');
//var express = require('express');
var router  = require('express').Router();
router.get('/', function(req, res) {
  models.Item.findAll().then(function(items) {
     var pageinfo={
      previous_page_number:1,
      number:2,
      num_pages:10,
      next_page_number:3,
      has_previous:true,
      has_next:true,
     };
     res.render('parts/items', {
      items: items,
      pageinfo:pageinfo
    });
  });
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
