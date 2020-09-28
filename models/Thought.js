const moment = require('moment');
const { Schema, model, Types } = require('mongoose');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            required: true,
            default: () => new Types.ObjectId
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        userName: {
            type: String,
            required: true,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        }
    },
    {
        toJSON: {
          virtuals: true,
          getters: true
        },
        id: false
      }
);

const ThoughtSchema = new Schema(
    {   
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        userName: {
            type: String,
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

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length
})

const Thought = model('Thought',ThoughtSchema)

module.exports = Thought