const db = require("../models");
const Friends = db.friends;

//new friends
exports.newFriend = async (req, res) => {
    const newFriend = new Friends({
        friends: [req.body.senderId, req.body.receiverId],
    });
    try {
        const savedNewFriend = await newFriend.save();
        res.status(200).json(newFriend);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

//get friends of a user
exports.getFriends = async (req, res) => {
    try {
        const friends = await Friends.find({
            friends: { $in: [req.params.userId] },
        }).populate("friend", "-id -_id -__v -email -password -roles -createdAt -updatedAt").select("-__v");
        res.status(200).json(friends);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
