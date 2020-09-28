const router = require('express').Router();
const {
    getAllUsers,
    getOneUser,
    createNewUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../controllers/user-controller')

// /api/users/
router
.get('/', getAllUsers)
.get('/:id', getOneUser)
.post('/', createNewUser)
.put('/:id', updateUser)
.delete('/:id', deleteUser)
.put('/:userId/friends/:friendId',addFriend)
.delete('/:userId/friends/:friendId', removeFriend)


module.exports = router