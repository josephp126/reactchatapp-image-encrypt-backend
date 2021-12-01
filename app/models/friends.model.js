const mongoose = require("mongoose");

const Friends = mongoose.model(
  "Friends",
  new mongoose.Schema({
    friends: {
        type: Array,
    }
},  { timestamps: true, toObject: { virtuals: true, }, toJSON: { virtuals: true } })
);

module.exports = Friends;