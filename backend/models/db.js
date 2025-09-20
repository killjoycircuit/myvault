const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email:    { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar:   { type: String, default: "" } // optional avatar link
});

const TagSchema = new Schema({
    name: { type: String, required: true, trim: true },
    color: { type: String, default: "#3B82F6" }, // Default blue color
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

// Create compound index to ensure tag names are unique per user
TagSchema.index({ name: 1, userId: 1 }, { unique: true });

const ContentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    tags: [{ type: Types.ObjectId, ref: "Tag" }], // Array of tag references
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
ContentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

const userModel = model("User", UserSchema);
const tagModel = model("Tag", TagSchema);
const contentModel = model("Content", ContentSchema);
const linkModel = model("Link", linkSchema);

module.exports = {
    userModel,
    tagModel,
    contentModel,
    linkModel
};
