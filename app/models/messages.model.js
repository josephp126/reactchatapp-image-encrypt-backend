const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    friendId: String,
    sender: {
        type: String
    },
    type: {
        type: String,
        default: 'text'
    },
    content: String,
},  { timestamps: true, toObject: { virtuals: true, }, toJSON: { virtuals: true } })
);

module.exports = Message;