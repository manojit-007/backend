const HttpError = require("../models/errorModel");
const Post = require('../models/postModel');
const User = require("../models/userModels");
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const cloudinary = require('cloudinary').v2;
const uploadCloudinary = require("../middlewares/CloudinaryUpload");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;

        if (!category) {
            category = "Uncategorized";
        }

        if (!title || !description ) {
            return next(new HttpError("Fill in all the fields ", 422));
        }
        if (!req.files) {
            return next(new HttpError("img not found", 422));
        }

        const thumbnailPath = req.files.thumbnail[0].path; 

        if (req.files.thumbnail[0].size > 2000000) {
            return next(new HttpError("Requested image size is too big. Should be less than 2mb", 422));
        }

        const uploadResult = await uploadCloudinary(thumbnailPath);

        if (!uploadResult || !uploadResult.secure_url) {
            return next(new HttpError("Error uploading thumbnail to Cloudinary", 500));
        }

        const newPost = await Post.create({ 
            title, 
            category, 
            description, 
            thumbnail: uploadResult.secure_url, 
            creator: req.user.id ,
            createdAt: Date.now()
        });

        if (!newPost) {
            return next(new HttpError("Post couldn't be created.", 422));
        }

        const currentUser = await User.findById(req.user.id);
        if (currentUser) {
            currentUser.posts += 1;
            await currentUser.save();
        }

        // res.status(201).json(newPost);
        res.status(201);
    } catch (error) {
        return next(new HttpError(error, 500));
    }
};





//get :api/posts unprotected
const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        res.status(201).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }

};

//get :api/posts/:id unprotected
const getPostDetail = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }
        res.status(201).json(post);
    } catch (error) {
        return next(new HttpError(error));
    }
};

//get :api/posts/users/:id unprotected
const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params
        const userAllPosts = await Post.find({ creator: id }).sort({ createdAt: -1 })

        if (userAllPosts.length < 1) {
            return next(new HttpError(`User have not post yet`));
        }
        res.status(200).json(userAllPosts);

    } catch (error) {
        return next(new HttpError(error));
    }
};



//patch :api/posts/:id unprotected

const editPost = async (req, res, next) => {
    try {
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!category) {
            category = "Uncategorized";
        }
        
        // Check if all required fields are provided
        if (!title || description.length < 12) {
            return next(new HttpError("Fill in all the fields properly.", 422));
        }

        if (!req.files || !req.files.thumbnail) {
            // If no new thumbnail provided, update post without changing the thumbnail
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description,createdAt: Date.now() }, { new: true });
        } else {
            const thumbnailPath = req.files.thumbnail[0].path; 

            if (req.files.thumbnail[0].size > 2000000) {
                return next(new HttpError("Requested image size is too big. Should be less than 2mb", 422));
            }

            const uploadResult = await uploadCloudinary(thumbnailPath);

            if (!uploadResult || !uploadResult.secure_url) {
                return next(new HttpError("Error uploading thumbnail to Cloudinary", 500));
            }

            // Update post with the new thumbnail URL
            updatedPost = await Post.findByIdAndUpdate(postId, { 
                title, 
                category, 
                description, 
                thumbnail: uploadResult.secure_url ,
                createdAt: Date.now()
            }, { new: true });
        }

        if (!updatedPost) {
            return next(new HttpError("Couldn't update post.", 400));
        }

        res.status(201).json(updatedPost);
    } catch (error) {
        return next(new HttpError(error));
    }
};





//delete :api/posts/:id unprotected
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post unavailable.", 400));
        }
        const post = await Post.findByIdAndDelete(postId)
        const filename = post?.thumbnail
        if (req.user.id == post.creator) {
            //delete thumbnail from storage
            fs.unlink(path.join(__dirname, '..', 'uploads', filename), async (err) => {
                if (err) {
                    return next(new HttpError(err));
                } else {
                    await Post.findByIdAndDelete(postId)
                    // Find the user and update post count 
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
                }
            });
        } else {
            return next(new HttpError("Unauthorized user", 400));
        }

        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }
        res.status(201).json(`post with ${postId} deleted successfully`);
    } catch (error) {
        return next(new HttpError(error));
    }
};




//post :api/posts/categories/:category unprotected
const getCategoryPost = async (req, res, next) => {
    try {
        const category = req.params.category;

        const categoryPost = await Post.find({ category }).sort({ createdAt: -1 })
        if (categoryPost.length < 1) {
            return next(new HttpError(`No posts found for category "${category}"`));
        }
        res.status(201).json(categoryPost);

    } catch (error) {
        return next(new HttpError(error));
    }
};


module.exports = { createPost, getAllPosts, getCategoryPost, getPostDetail, getUserPosts, editPost, deletePost }