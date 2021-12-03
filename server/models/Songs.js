const mongoose = require("mongoose");

const SongsSchema = new mongoose.Schema({
    name: {type:String, trim:true,require:true},
    slug: {type:String, trim:true,require:true},
    content: {type:String, trim:true,require:true},
    descriptions: {type:String, trim:true,require:true},
    keywords: {type:String, trim:true,require:true},
},{timestamps:true});

module.exports = mongoose.model('Songs', SongsSchema)