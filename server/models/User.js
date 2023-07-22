import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 5
        },
        playlists: {
            type: Array,
            default: []
        },
        isPlatina: {
            type: Boolean,
            default: true
        },
        location: String,
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;