const { User, Thought } = require('../models');

const userController = {
    async getAllUsers(req,res) {
        try {
            const users = await User.find({})
            .select('-__v')
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
            .select('-__v')
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
            // we can't use select() to remove the __v attribute after creating, so we cast the mongo object to a standard object 
            // and remove __v before sending the response
            let userResponse = user.toObject()
            delete userResponse.__v
            res.json(userResponse)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async updateUser({ params, body },res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id:params.id},
                body,
                {new: true}
            )
            .select('-__v')
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
            const user = await User.findOneAndDelete({_id:id})
            .select('-__v')
            if (!user) {
                res.json({message: 'No user found with that id'})
                return
            }
            if (user.thoughts.length > 0) {
                await Thought.deleteMany({userName:user.userName})
            }
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
            .select('-__v')
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
            .select('-__v')
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