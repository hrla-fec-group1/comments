const express = require('express');
const parser = require('body-parser');
const path = require('path');
const PORT = 3000;
const faker = require('faker')

const app = express();
const mongoose = require('mongoose');
const Comments = require('../database/comments.js');
app.use(express.static(path.join(__dirname, '../static')));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.get('/data',function(req,res){
  Comments.find(function(err,data){
    if(err){
      console.log(err)
    } else{
      res.send(data)
    }
  })
})
app.patch('/data',function(req,res){
  console.log(req.body)
  var temp = {}
  temp.reply = req.body.replies
  temp.pic = faker.internet.avatar()
  temp.userName = faker.internet.userName()
  Comments.update({_id:req.body.index},{$push:{replies:temp}},function(err,data){
    if(err){
      console.log(err)
    } else{
      res.sendStatus(204)
    }
  })
})


app.listen(PORT, () => {
  console.log('App is listening on PORT:', PORT);
});
