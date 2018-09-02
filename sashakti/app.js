var express = require("express");
var app = express();
var BodyParser = require("body-parser");
var mongoose = require("mongoose");
var fs = require("fs");
var multer = require('multer');
mongoose.connect("mongodb://localhost/cat_app");

app.set("view engine", "ejs");
app.use(BodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var upload = multer({ dest: 'uploads/' })

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    gender: String,
    dob: String,
    email: String,
    password: String,
    aadhar: String,
    occupation: String,
    tags: [String],
    img: String
});
var infoSchema = new mongoose.Schema({
    name: String,
    description: String,
    endDate: String,
    views: Number,
    tag: String,
    img: String
});

var applyschema= new mongoose.Schema({
   email: String,
   name:String,
   date : String,
   aadhar : Number,
   img : String
});
var User = mongoose.model("User", UserSchema);
var Scheme = mongoose.model("Scheme", infoSchema);
var AppliedUsers = mongoose.model("AppliedUsers",applyschema);

app.get("/check", function(req, res) {
    var email = req.query.email;
    User.find({ email: email }, function(err, user) {
        if (err) {
            console.log("Something Went Wrong");
            console.log(err);
        }
        else {

            if (!user.length) {
                res.send("0");
            }
            else {
                res.send("1");

            }
        }
    });
});

app.post("/newuser", function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var email = req.body.email;
    var password = req.body.password;
    var aadhar = req.body.aadhar;
    var occupation = req.body.occupation;
    var tags = req.body.tag;

    User.find({ email: email }, function(err, user) {
        if (err) {
            console.log("Something Went Wrong");
            console.log(err);
        }
        else {

            if (!user.length) {
                User.create({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    gender: gender,
                    dob: dob,
                    password: password,
                    aadhar: aadhar,
                    occupation: occupation,
                    tags: tags
                }, function(err, user) {
                    if (err) {
                        console.log("Something Went Wrong");
                    }
                    else {
                        res.send("We saved a User");
                        console.log(user);
                    }
                });
            }
            else {
                console.log("We found the user");
                console.log(user[0].firstname);

            }
        }
    });


});

app.get("/login", function(req, res) {
    var email = req.query.email;
    var password = req.query.password;
    User.find({ email: email }, function(err, user) {
        if (err) {
            console.log("Something Went Wrong");
            console.log(err);
        }
        else {
            if (user[0].password == password) {
                res.send("1");
            }
            else {
                res.send("0");
            }
        }
    });
});

app.get("/schemes", function(req, res) {
    var email = req.query.email;
    var A = [];
    var B = [];
    
    User.find({ email: email }, function(err, user) {

        if (err) {
            console.log("Something Went Wrong");
            console.log(err);
        }
        else {
            var tags = user[0].tags;
            console.log(tags)
            tags.forEach(function(tag) {
                
               const q = Scheme.find({tag:tag }, function(err, scheme) {
                    if (err) {
                        console.log("Something Went Wrong");
                        console.log(err);
                    }
                    else {
                        
                        scheme.forEach(function(i) {
                            A.push(i);
                        });
                        
                    
                    }
                    q.then(() => res.send(A));
                });
                
                
            });
            
        }

    });

});

app.post("/tempsignup", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.create({
        email: email,
        password: password
    }, function(err, user) {
        if (err) {
            console.log("Something Went Wrong");
            console.log(err);
            res.send("0");
        }
        else {
            console.log("We saved a User");
            console.log(user);
            res.send("1");
        }
    });
});

app.post("/update", function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var password = req.body.password;
    var aadhar = req.body.aadhar;
    var occupation = req.body.occupation;
    var tags = req.body.tags;
    var image=req.body.image;

    User.update({
        email: email
    }, {
        $set: {
            firstname: firstname,
            lastname: lastname,
            aadhar: aadhar,
            gender: gender,
            dob: dob,
            occupation: occupation,
            tags: tags,
            img: image
        }
    }, function(err, user) {
        if (err) {
            console.log("Something Went Wrong");
            res.send("0");
        }
        else {
            console.log("We saved a User");
            console.log(user);
            res.send("1");
        }
    });
});

app.get("/schemeDetail", function(req, res) {
    var name = req.query.name;
    Scheme.find({
        name: name
    }, function(err, scheme) {
        if (err) {
            console.log("Something Went Wrong");
            console.log(err);
        }
        else {
            var views = scheme[0].views + 1;
            res.json(scheme);
            Scheme.update({
                name: name
            }, {
                $set: {
                    views: views
                }
            }, function(err, scheme1) {
                if (err) {
                    console.log("Something Went Wrong");
                }
                else {
                    console.log("Scheme updated");
                }
            });
        }
    });
});

// Scheme.update({ name: 'Sanchar Kranti Yojana (SKY)'},
// {$set:{
//     img:"https://res.cloudinary.com/dsdrnalid/image/upload/v1535840188/shashakti/sky.png"
// }},function(err,user){
//     if(!err){
//         // user.forEach(function(u){
//             console.log(user);
//         // });
        
        
//     }
//     else{
//         console.log(err);
//     }
// });
Scheme.find({},function(err,scheme) {
  if(!err){
      scheme.forEach(function(e){
            console.log(e.tag);    
      });
  } 
});

app.get("/search",function(req, res) {
   var tag=req.query.tag;
   if(tag=="All"){
       Scheme.find({},function(err, scheme) {
           if(!err){
               res.json(scheme);
           }
       });
   }
   else{
       Scheme.find({tag:tag},function(err,scheme){
           if(!err){
               res.json(scheme);
           }
       });
   }
});

app.post("/newscheme", function(req, res) {
    var name = req.body.name;
    var description = req.body.desc;
    var endDate = req.body.date;
    var views = req.body.views;
    var tag = req.body.tag;
    var image=req.body.image;


    Scheme.create({
        name: name,
        description: description,
        endDate: endDate,
        views: views,
        tag: tag,
        img: image
    }, function(err, scheme) {
        if (err) {
            console.log("Something Went Wrong");
        }
        else {
            console.log("Scheme updated");
            console.log(scheme);
            res.send(scheme);
        }
    });
});

app.post("/apply",function(req, res) {
   var email= req.body.email;
   var name= req.body.name;
   var date = "02/09/18";
   var aadhar = req.body.aadhar;
//   AppliedUsers.find({ email: email,name:name }, function(err, user) {
//         if (err) {
//             console.log("Something Went Wrong");
//             console.log(err);
//         }
//         else {

//             if (!user.length) {
   
   AppliedUsers.create({
       email:email,
       name:name,
       date:date,
       aadhar:aadhar,
   },function(err, apuser) {
        if (err) {
            console.log("Something Went Wrong");
            res.send("0");
        }
        else {
            console.log("Scheme updated");
            console.log(apuser);
            res.send("1");
        }
    });
        

});
//  AppliedUsers.create({
//       email:"aditya@gmail.com",
//       name:'Sanchar Kranti Yojana (SKY)',
//       date:Date.now(),
//       aadhar:'123456',
//       img:"https://res.cloudinary.com/dsdrnalid/image/upload/v1535840188/shashakti/sky.png"
//   },function(err, apuser) {
//         if (err) {
//             console.log("Something Went Wrong");
//             console.log("0");
//         }
//         else {
//             console.log("Scheme updated");
//             console.log(apuser);
            
//         }
//     });
// User.remove({},function(err){
//     if(!err){
//         console.log("Done!!");
//     }
// });

// User.find({},function(err,user){
//     if(!err){
//         console.log(user);
//     }
// });

app.get("/getusers",function(req, res) {
    AppliedUsers.find({},function(err, user) {
       if(!err){
           res.render("index",{user:user});
       } 
       else{
           console.log(err);
       }
    });
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!!");
});