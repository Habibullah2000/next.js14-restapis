import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        email: {type: "string", requried: true, unique: true},
        username:{type: "string", required: true, unique:true},
        password: {type: "string", requried: true, unique:true },   
    },
    {
        timestamps:true
    }
)

const User = models.User || model('User', UserSchema);
export default User;