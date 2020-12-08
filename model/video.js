const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hee:2852@hee.pcfo2.mongodb.net/<dbname>?retryWrites=true&w=majority' , 
{useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})
.then(() => console.log("몽고디비 성공"))
.catch(err => console.log(err))

let Schema = mongoose.Schema

let videoSchema = new Schema({

 
    title: {
        type:String,
        maxlength:50
    },
    description: {
            type:String
    },

    filePath : {
        type:String
    },
    fileName: {
        type:String
    },
    thumbName : {
        type:String
    }


}, {timestamps: true})

let Video = mongoose.model('Video' , videoSchema);

module.exports = {Video}