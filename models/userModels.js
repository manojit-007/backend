const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        require: true,
    },
    avatar: {
        type: String,
        default: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v,
    },
    posts:{
        type: Number,
        default: 0
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews"
        }
    ]
});

//compare password for login
userSchema.methods.checkPassword = async function (enteredPasswordForLogin) {
    return await bcrypt.compare(enteredPasswordForLogin, this.password)
}

const User = mongoose.model("User", userSchema)

module.exports = User;