const mongoose=require('mongoose')
const Document=require('./document')
const User=require('./userModel')
const express = require("express");
const cors=require("cors")
const app = express();

const session=require('express-session')
const path = require("path");
__dirname = path.resolve();

const passport = require('./authentication').passport; 
const { isAuthenticated } = require('./authentication'); 

app.use(cors({ origin: "*" }));

app.use(session({ secret: process.env.AUTHSECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/login/success',async(req,res)=>{
    if(req.user){
        const newUser= await User.findOne({ googleId:req.user.googleId})
        .populate({
        path: 'documents',
        select: 'name', 
         });
        res.status(200).json({message:"user Login",user:newUser})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})

if (process.env.NODE_ENV === "development") {
    app.use(express.static(path.join(__dirname, "/client/build")));
  
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
  } else {
    app.get("/", (req, res) => {
      res.send("API is running..");
    });
  }
  

const io=require("socket.io")(3001,{
    cors:{
        origin: "*",
        methods:['GET','POST'],
    }
})

const defaultValue=""

io.on("connection", socket => {
    socket.on("get-document", async ({documentId,userId}) => {
    
      const document = await findOrCreateDocument(documentId,userId)
      socket.join(documentId)
      socket.emit("load-document", document.data)
  
      socket.on("send-changes", delta => {
        socket.broadcast.to(documentId).emit("receive-changes", delta)
      })
  
      socket.on("save-document", async data => {
        await Document.findByIdAndUpdate(documentId, { data })
      })
    })
  })
  
  async function findOrCreateDocument(documentId,userId) {
    if (documentId == null) return
  
    let document = await Document.findById(documentId)
    if (document) return document
    document = await Document.create({ _id: documentId, data: defaultValue })
    if(userId)
    await User.findByIdAndUpdate(userId, { $push: { documents: documentId }});
    return document
  }

  module.exports = app;  