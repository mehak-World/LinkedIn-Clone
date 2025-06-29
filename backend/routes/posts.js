const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');
const multer = require("multer")
const { handleUpload } = require("../utils/cloudinary_config.js")
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

router.post("/create", upload.array('images', 5), async (req, res) => {
    console.log(req.body.userId);
    const imageFiles = req.files; // array of files
    const imageUrls = [];

    for (const file of imageFiles) {
      const result = await handleUpload(file.path);
      console.log(result);
      imageUrls.push(result.secure_url); // Store the secure URL of the uploaded image
    }

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.body.userId,
        images: imageUrls
    });

    await post.save()
    console.log(post);
    res.status(200).json(post);
})


router.get("/all", async (req, res) => {
    try {
        const posts = await Post.find().populate("author").populate("comments.author");
        res.status(200).send(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
})

router.post("/like", async (req, res) => {
    const {postId, new_peopleLiked} = req.body;
    console.log(req.body);
   const liked_post = await Post.findByIdAndUpdate(postId, {peopleLiked: new_peopleLiked}, {new: true})
   console.log(liked_post);
   res.status(200).json({message: "Post liked successfully"});
})

router.post("/comment", async (req, res) => {
    const { postId, content, author } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const comment = {
            content: content,
            author}
        post.comments.push(comment);
        await post.save();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add comment" });
    }
})

router.post("/:postId/delete/:commentId", async(req, res) => {
    const { postId, commentId } = req.params;
    console.log(postId, commentId);

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Filter out the comment with the specified ID
        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete comment" });
    }
})

router.get("/:user_id", async (req, res) => {
    const id = req.params.user_id;
    const posts = await Post.find({author: id})
    res.send(posts);
})

router.post("/:post_id/delete", async (req, res) => {
    const { post_id } = req.params;
    await Post.findByIdAndDelete(post_id)
    res.send("deleted post")
})

module.exports = router;