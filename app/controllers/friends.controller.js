const db = require("../models");
const Friends = db.friends;
const Users = db.user;

//new friends
exports.newFriend = async (req, res) => {
    const newFriend = new Friends({
        friends: [req.body.senderId, req.body.receiverId],
        friend:req.body.receiverId
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
        // const friends = await Friends.find({
        //     friends: { $in: [req.params.userId] },
        // }).populate("friend", "-id -_id -__v -email -password -roles -createdAt -updatedAt").select("-__v");
        // res.status(200).json(friends);
        let friends = await Friends.find({
            friends: { $in: [req.params.userId] },
        });
        let friendsData = JSON.parse(JSON.stringify(friends))
        // console.log('friends:', friends)
        let userList = []
        await Promise.all(friendsData.map( async (friend,index) => {
            const friendId = friend.friends.find((m) => m !== req.params.userId);
            const user = await Users.findOne({_id : friendId})
            friendsData[index].friend = JSON.parse(JSON.stringify(user))
            console.log('----------',friendsData[index])
            // userList = userList.push(user)
        }))
        console.log("==========",friendsData)
        // let friendList = friends.populate("friend", "-id -_id -__v -email -password -roles -createdAt -updatedAt").select("-__v");
        res.status(200).json(friendsData);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
