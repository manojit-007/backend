const { Router } = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const { createPost, getAllPosts, getCategoryPost, getPostDetail, getUserPosts, editPost, deletePost } = require('../controllers/postControllers')

const authMiddleWare = require('../middlewares/authMiddleWare')

const router = Router()

router.post('/',authMiddleWare,createPost)

router.get('/', getAllPosts)
router.get('/users/:id',getUserPosts)
// router.get('/:id', authMiddleWare,getPostDetail)
router.get('/:id',getPostDetail)
router.patch('/:id',authMiddleWare, editPost)
router.delete('/:id', authMiddleWare,deletePost)
router.get('/categories/:category', getCategoryPost)

module.exports = router