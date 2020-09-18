const router = require('express').Router();
const {
    getAllThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../controllers/thought-controller')

router
.get('/', getAllThoughts)
.get('/:id', getOneThought)
.post('/', createThought)
.put('/:id', updateThought)
.delete('/:id', deleteThought)
.put('/:id/reactions', addReaction)
.delete('/:thoughtId/reactions/:reactionId', deleteReaction)

module.exports = router