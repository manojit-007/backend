const { Router } = require('express')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

const { registerUser, loginUser, getUser, changeAvatar, updateUser, getAuthors } = require('../controllers/userControllers')
const authMiddleWare = require('../middlewares/authMiddleWare')
const router = Router()

// router.get('/', (req, res, next) => {
//     res.json("This is the user route")
// })


router.get('/', getAuthors)
router.get('/:id', getUser)
router.post('/register', registerUser)
router.post('/login', loginUser)

router.post('/changeProfilePic',authMiddleWare,changeAvatar )
router.patch('/update-user',authMiddleWare, updateUser)



module.exports = router