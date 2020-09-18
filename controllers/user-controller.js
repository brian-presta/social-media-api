const { User, Thought } = require('../models');

const userController = {
    async getAllUsers(req,res) {
        try {
            const users = await User.find({})
            res.json(users)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async getOneUser({ params:{id} },res) {
        try {
            const user = await User.findOne({_id:id})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            if (!user) {
                res.json({message: 'No user found with that id'})
                return
            }
            res.json(user)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async createNewUser({ body },res) {
        try {
            const user = await User.create(body)
            res.json(user)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async updateUser({ params,body },res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id:params.id},
                body,
                {new: true}
            )
            if (!user) {
                res.json({message: 'No user found with that id'})
                return
            }
            res.json(user)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async deleteUser({ params:{id}, res}) {
        try {
            const user = await User.findOneAndDelete(
                {_id:id},
                {new:true}
            )
            if (!user) {
                res.json({message: 'No user found with that id'})
                return
            }
            const thoughts = await Thought.deleteMany({userName:user.userName})
            res.json(user)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async addFriend({ params }, res) {
        try {
            const { userId,friendId} = params
            const user = await User.findOneAndUpdate(
                {_id:userId},
                {$push: {friends: friendId}},
                {new: true}
            )
            if (!user) {
                res.json({message: 'No user found with that id'})
                return
            }
            res.json(user)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async removeFriend({ params }, res) {
        try {
            const { userId,friendId} = params
            const user = await User.findOneAndUpdate(
                {_id:userId},
                {$pull: {friends: friendId}},
                {new: true}
            )
            if (!user) {
                res.json({message: 'No user found with that id'})
                return
            }
            res.json(user)
        }
        catch(err) {
            res.status(400).json(err)
        }
    }
}

module.exports = userController