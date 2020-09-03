const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mongoose ObjectId
//const ObjectId = Schema.ObjectId;

// define a user schema
const blogSchema = new Schema({
    privateId:{
        type: String
    },
    title: {
        type: String,
        required: [true, 'Please enter a title'],
    },
    content:{
        type: String,
        required: [true, 'Please write a content'],
    },
    author:{
        type: String,
        required: [true, 'Please write an author']
    },
    postDate:{
        type: Date,
        default: Date.now
    }
});

module.exports = Blog = mongoose.model('blog', blogSchema);