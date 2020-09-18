const moment = require('moment');
const { Schema, model, Types } = require('mongoose');

const ReactionSchema = new Schema(
    {

    }
);

const ThoughtSchema = new Schema(
    {   thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
        userName: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
          virtuals: true,
          getters: true
        },
        id: false
      }
);



const Thought = model('Thought',ThoughtSchema)

module.exports = Thought