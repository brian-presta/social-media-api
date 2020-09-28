const { User, Thought } = require('../models');

const thoughtController = {
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find({})
            .select('-__v')
            res.json(thoughts)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async getOneThought({ params:{id} }, res) {
        try {
            const thought = await Thought.findOne({_id:id})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            if (!thought) {
                res.json({message: 'No thought found with that id'})
                return
            }
            res.json(thought)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async createThought({ body }, res) {
        try {
            const user = await User.findOne({userName:body.userName})
            if (!user) {
                res.status(400).json({message: 'Username invalid'})
                return
            }
            const thought = await Thought.create(body)
            await user.update({$push: {thoughts: thought._id} })
            let thoughtResponse = thought.toObject()
            delete thoughtResponse.__v
            res.json(thoughtResponse)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async updateThought({ params, body },res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id:params.id},
                body,
                {new: true}
            )
            .select("-__v")
            if (!thought) {
                res.json({message: 'No thought found with that id'})
                return
            }
            res.json(thought)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async deleteThought({ params: {id} },res) {
        try {
            const thought = await Thought.findOneAndDelete({_id:id})
            .select("-__v")
            if (!thought) {
                res.json({message: 'No thought found with that id'})
                return
            }
            res.json(thought)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async addReaction({ params, body }, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id:params.id},
                {$push: {reactions: body} },
                {new: true}
            )
            .select("-__v")
            if (!thought) {
                res.json({message: 'No thought found with that id'})
                return
            }
            res.json(thought)
        }
        catch(err) {
            res.status(400).json(err)
        }
    },
    async deleteReaction({ params }, res) {
        try {
            const { thoughtId, replyId } = params
            const thought = await Thought.findOneAndUpdate(
                {_id: thoughtId},
                {$pull: {reactions: {replyId} } }
            )
            .select("-__v")
            if (!thought) {
                res.json({message: 'No thought found with that id'})
                return
            }
            res.json(thought)
        }
        catch(err) {
            res.status(400).json(err)
        }
    }
    
}

module.exports = thoughtController