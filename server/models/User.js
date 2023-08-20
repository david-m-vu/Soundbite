import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        username: {
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
        location: String,
        isFirstTimeUser: {
            type: Boolean,
            default: true
        },
        playlists: {
            type: Array,
            default: []
        },
        billingID: String,
        isPlatina: {
            type: Boolean,
            default: true
        },
        hasTrial: {
            type: Boolean,
            default: false
        },
        usedAPI: {
            type: Number,
            default: 0
        },
        endDate: {
            type: Date,
            default: null
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;