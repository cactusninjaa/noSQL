import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    }
})
UserSchema.index(
    { firstName: "text", lastName: "text" },
);

const User = mongoose.model("User", UserSchema);

export default User;