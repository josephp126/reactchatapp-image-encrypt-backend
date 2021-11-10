const mongoose = require("mongoose");

const Chat = mongoose.model(
  "Chat",
  new mongoose.Schema({
    id: Number,
    chatId: Number,
    sender: {
        name: String,
        email: String,
        avatar: String
    },
    type: {
        type: String,
        default: 'text'
    },
    message: String,
    read_info: [
        {
            email: {
                type: String
            },
            status: {
                type: Boolean
            }
        }
    ]
},  { timestamps: true, toObject: { virtuals: true, }, toJSON: { virtuals: true } })
);

module.exports = Chat;