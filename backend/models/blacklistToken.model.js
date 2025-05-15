import mongoose from "mongoose";


const blacklistTokenSchema = new mongoose.Schema(
    {
        token: {
        type: String,
        required: true,
        },
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
        createdAt: {
        type: Date,
        default: Date.now,
        expires: "1d", // Token will expire after 1 day
        },
    },
    { timestamps: true }
    );
const BlacklistToken = mongoose.models.BlacklistToken || mongoose.model("BlacklistToken", blacklistTokenSchema);
export default BlacklistToken;