const {Schema,model}=require('mongoose')

const User=new Schema({
    googleId: String,
    name: String,
    email:String,
    documents: [{
        type: String,
        ref: 'Document',
      }],

},{timestamps: true})

module.exports = model("User", User)