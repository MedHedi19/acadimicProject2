const Post = require("../models/postSchema");

async function createPost(req, res) {
    try {
        const { title, content, type, targetUsers } = req.body;
        const userId = req.user.id;
        if (!title || !content || !type) {
            return res.status(400).json("All fields are required");
        }

        if (type === "Targeted" && (!targetUsers || targetUsers.length === 0)) {
            return res.status(400).json("Targeted posts require at least one target user");
        }

        const post = new Post({
            title,
            content,
            type,
            targetUsers: type === "Targeted" ? targetUsers : [],
            createdBy: userId,
        });

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
}
async function getPosts(req, res) {
    try {
        const userId = req.user.id;

        const posts = await Post.find({
            $or: [
                { type: "Public" },
                { type: "Targeted", targetUsers: userId },
            ],
        })
            .populate("createdBy", "username email")
            .populate("targetUsers", "username email");

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err.message);
    }
}

async function deletePost(req, res) {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json("Post not found");
        }


        await Post.findByIdAndDelete(postId);
        res.status(200).json("Post has been deleted");
    } catch (err) {
        res.status(500).json(err.message);
    }
}

module.exports = {
    createPost,
    getPosts,
    deletePost
};
