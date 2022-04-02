const express = require("express");
const cors = require("cors");
const res = require("express/lib/response");
const app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const PORT = process.env.PORT || 5000 ;
var jwt = require('jsonwebtoken');
var secret = 'login-admin'
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mysql = require('mysql2');
app.use(cors())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mydb'
  });

// เผื่อจะสร้างรหัสใหม่ 
app.post('/register',jsonParser,function(req,res,next){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        connection.execute(
            'INSERT INTO user (id,password) VALUES(?,?)',
            [req.body.id,hash],
            function(err,results, fields) {
            if(err){res.json({status:'error',message:err});return}
            res.json({status :'ok'})
    
            }
        );
    });
})

app.post('/login',jsonParser,function(req,res,next){
    connection.execute(
        'SELECT * FROM user WHERE id=?',
        [req.body.id],
        function(err,user, fields) {
        if(err){res.json({status:'error',message:err});return}
        if(user.length == 0){res.json({status:'error',message:"no user found"});return}
        bcrypt.compare(req.body.password, user[0].password, function(err, islogin) {
            if(islogin){
                var token = jwt.sign({ id:user[0].id }, secret, { expiresIn: '1h' });
                res.json({status :'ok',message:'success',token})
            }else{
                res.json({status :'error',message:'fail'})
            }
        });
        }
    );
})

app.post('/authen',jsonParser,function(req,res,next){
    const token = req.body.token;
    try{
        var decoded = jwt.verify(token, secret);
        res.json({status:'ok', decoded})
        res.json({decoded});        
    }catch(err){
        res.json({status:'error',message: err.message})
    }
})

app.listen(PORT,()=>console.log(`server is running on PORT ${PORT}`));
