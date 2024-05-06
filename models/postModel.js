const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String, // Change type to array of strings
        default: "Uncategorized", // Set default to an array with "Uncategorized"
        enum: [
            "Uncategorized",
            "Technology",
            "Travel",
            "Food",
            "Fashion",
            "Health",
            "Sports",
            "Education",
            "Entertainment",
            "Business",
            "Science",
            "Art",
            "Music",
            "Fitness",
            "Books",
            "Photography"
        ],
        message: "Value is not supported"
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        default: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: v => (v === "" ? "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v)
    },
    creator:
    {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt:
    {
        type: Date
    }

    // });
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
