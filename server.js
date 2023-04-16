require("dotenv").config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const md5 = require('md5')
var cookieParser = require('cookie-parser')

const app=express();
app.set("view engine","ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

mongoose
.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    app.listen(3000, function () {
      console.log("Server is listening to port 3000");
    })
  console.log("Successfully connected to database");
})
.catch((error) => {
  console.log("Database connection failed.");
  console.error(error);
});

const userSchema=new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  level_login: {type: Date, default: null},
  level1: {type: Date, default: null},
  level2: {type: Date, default: null},
  level3: {type: Date, default: null},
  level4: {type: Date, default: null},
  level5: {type: Date, default: null},
  level6: {type: Date, default: null}
});

const User=new mongoose.model("user",userSchema);

app.post("/register", async (req, res) => {
    try {
      const { username} = req.body;
      if (!(username)) {
        res.status(400).send("All input is required");
      }
      const oldUser = await User.findOne({ username });
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
      const user = await User.create({
        username,
        password: md5(username)
      });
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!(username && password)) {
        res.status(400).send("All input is required");
      }
      const user = await User.findOne({ username });
  
      if (user && password===user.password) {
        const token = jwt.sign(
          { user_id: user._id, username },
          process.env.TOKEN_KEY
        );
        if(user.level_login === null) {
          const doc = await User.findOneAndUpdate({_id: user._id}, {level_login: new Date()}, {
            new: true
          });
        }
        res.cookie('shrlck__jwt',token, { httpOnly: true, maxAge: 172800000 }).status(200).json(user);
      } else {
        res.status(400).send("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
    }
  });

app.get("/", function(req,res) {
    res.render("login");
})

app.get("/level1",async function(req,res) {
  if(verifyToken(req.cookies.shrlck__jwt)) {
    const user = await User.findOne({ _id: verifyToken(req.cookies.shrlck__jwt).user_id });
    if(user.level_login===null) {
      res.render("unauthorized");
    } else {
      res.render("level1");
    }
  } else {
    res.render("unauthorized");
  }
   
})

app.post("/answer", async function(req,res) {
  try {
    const { answer, level } = req.body;
    const answer_list = {
      level2: "aniswar",
      level3: "mahakchhajer",
      level4: "011",
      level5: "smcc",
      level6: "sayak china"
    }
    if (!(answer && level)) {
      res.status(400).send("All input is required");
    }
    if(verifyToken(req.cookies.shrlck__jwt)) {
      const user = await User.findOne({ _id: verifyToken(req.cookies.shrlck__jwt).user_id });
      if(level ==1) {
        let pattern = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/([0-9]{4})$/;
        if(pattern.test(answer)) {
          if(user.level1 === null) {
            const doc = await User.findOneAndUpdate({_id: user._id}, {level1: new Date()}, {
              new: true
            });
          }
          res.status(200).json({result: "correct"})
        } else {
          res.status(200).json({result: "incorrect"})
        }
      } else if(level == 2) {
        if(answer.toLowerCase() ==answer_list.level2.toLowerCase()) {
          if(user.level2 === null) {
            const doc = await User.findOneAndUpdate({_id: user._id}, {level2: new Date()}, {
              new: true
            });
          }
          res.status(200).json({result: "correct"})
        } else {
          res.status(200).json({result: "incorrect"})
        }
      } else if(level == 3) {
        if(answer.toLowerCase() ==answer_list.level3.toLowerCase()) {
          if(user.level3 === null) {
            const doc = await User.findOneAndUpdate({_id: user._id}, {level3: new Date()}, {
              new: true
            });
          }
          res.status(200).json({result: "correct"})
        } else {
          res.status(200).json({result: "incorrect"})
        }
      } else if(level == 4) {
        if(answer.toLowerCase() ==answer_list.level4.toLowerCase()) {
          if(user.level4 === null) {
            const doc = await User.findOneAndUpdate({_id: user._id}, {level4: new Date()}, {
              new: true
            });
          }
          res.status(200).json({result: "correct"})
        } else {
          res.status(200).json({result: "incorrect"})
        }
      } else if(level == 5) {
        if(answer.toLowerCase() ==answer_list.level5.toLowerCase()) {
          if(user.level5 === null) {
            const doc = await User.findOneAndUpdate({_id: user._id}, {level5: new Date()}, {
              new: true
            });
          }
          res.status(200).json({result: "correct"})
        } else {
          res.status(200).json({result: "incorrect"})
        }
      } else if(level == 6) {
        if(answer.toLowerCase() ==answer_list.level6.toLowerCase()) {
          if(user.level6 === null) {
            const doc = await User.findOneAndUpdate({_id: user._id}, {level6: new Date()}, {
              new: true
            });
          }
          res.status(200).json({result: "correct"})
        } else {
          res.status(200).json({result: "incorrect"})
        }
      } else {
        res.status(400).send("Wrong input");
      }
    } else {
      res.status(400).send("No token");
    }
  } catch (err) {
    console.log(err);
  }
})

app.get("/congratulations",async function(req,res) {
  if(verifyToken(req.cookies.shrlck__jwt)) {
    const user = await User.findOne({ _id: verifyToken(req.cookies.shrlck__jwt).user_id });
    if(user.level_login!==null && user.level1!==null && user.level2!==null && user.level3!==null && user.level4!==null && user.level5!==null && user.level6!==null) {
      res.render("congratulations");
    } else {
      res.render("unauthorized");
    }
  } else {
    res.render("unauthorized");
  }
})

app.get("/level2",async function(req,res) {
  if(verifyToken(req.cookies.shrlck__jwt)) {
    const user = await User.findOne({ _id: verifyToken(req.cookies.shrlck__jwt).user_id });
    if(user.level_login!==null && user.level1!==null) {
      res.render("level2");
    } else {
     res.render("unauthorized");
    }
  } else {
    res.render("unauthorized");
  }
})

app.get("/login_puzzle", function(req,res) {
    res.render("login_puzzle");
})

app.get("/level3", async function(req,res) {
  if(verifyToken(req.cookies.shrlck__jwt)) {
    const user = await User.findOne({ _id: verifyToken(req.cookies.shrlck__jwt).user_id });
    if(user.level_login!==null && user.level1!==null && user.level2!==null) {
      res.render("level3");
    } else {
     res.render("unauthorized");
    }
  } else {
    res.render("unauthorized");
  }
})

app.get("/level4", async function(req,res) {
  if(verifyToken(req.cookies.shrlck__jwt)) {
    const user = await User.findOne({ _id: verifyToken(req.cookies.shrlck__jwt).user_id });
    if(user.level_login!==null && user.level1!==null && user.level2!==null && user.level3!==null) {
      res.render("level4");
    } else {
     res.render("unauthorized");
    }
  } else {
    res.render("unauthorized");
  }
})

app.get("/polybius",async function(req,res) {
  if(verifyToken(req.cookies.shrlck__jwt)) {
    const user = await User.findOne({ _id: verifyToken(req.cookies.shrlck__jwt).user_id });
    if(user.level_login!==null && user.level1!==null && user.level2!==null && user.level3!==null && user.level4!==null) {
      res.render("level5");
    } else {
     res.render("unauthorized");
    }
  } else {
    res.render("unauthorized");
  }
})

app.get("/level6",async function(req,res) {
  if(verifyToken(req.cookies.shrlck__jwt)) {
    const user = await User.findOne({ _id: verifyToken(req.cookies.shrlck__jwt).user_id });
    if(user.level_login!==null && user.level1!==null && user.level2!==null && user.level3!==null && user.level4!==null && user.level5!==null) {
      res.render("level6");
    } else {
     res.render("unauthorized");
    }
  } else {
    res.render("unauthorized");
  }
})

const verifyToken = (token) => {
  if (!token) {
    return false;
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return decoded;
  } catch (err) {
    return false;
  }
};

