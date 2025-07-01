const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const router = express.Router();
const Post = require("../models/Post.js");
const multer = require("multer");
const { handleUpload } = require("../utils/cloudinary_config.js");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const { generateImage } = require("../utils/gemini_setup.js");
const ai = new GoogleGenAI({ api_key: process.env.GOOGLE_GEMINI_KEY });
const { v2: cloudinary } = require("cloudinary");

router.post("/create", upload.array("images", 5), async (req, res) => {
  console.log(req.body.userId);
  const imageFiles = req.files;
  const imageUrls = [];

  for (const file of imageFiles) {
    const result = await handleUpload(file.path);
    imageUrls.push({ url: result.secure_url, public_id: result.public_id });
  }

  const post = new Post({
    title: req.body?.title,
    content: req.body.content,
    author: req.body.userId,
    images: imageUrls,
  });

  await post.save();
  console.log(post);
  res.status(200).json(post);
});

router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "author",
        populate: {
          path: "profile",
        },
      })
      .populate("comments.author");
    res.status(200).send(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post("/like", async (req, res) => {
  const { postId, new_peopleLiked } = req.body;
  console.log(req.body);
  const liked_post = await Post.findByIdAndUpdate(
    postId,
    { peopleLiked: new_peopleLiked },
    { new: true }
  );
  console.log(liked_post);
  res.status(200).json({ message: "Post liked successfully" });
});

// Comment on a post
router.post("/comment", async (req, res) => {
  const { postId, content, author } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comment = {
      content: content,
      author,
    };
    post.comments.push(comment);
    await post.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get all the posts for specific user
router.get("/:user_id", async (req, res) => {
  try {
    const id = req.params.user_id;
    const posts = await Post.find({ author: id });
    res.send(posts);
  } catch (err) {
    res.status(500).send("Error occured while fetching posts");
  }
});

// Delete a post
router.post("/:post_id/delete", async (req, res) => {
  try {
    const { post_id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(post_id);
    for (const image of deletedPost.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
    res.status(200).send("deleted post");
  } catch (err) {
    res.status(500).send("Error occured while deleting post");
  }
});

// Create post using ai
router.post("/ai/create", upload.single("image"), async (req, res) => {
  const { keywords } = req.body;
  const marked = await import("marked").then((mod) => mod.marked);
  console.log(keywords);
  // Make a call to the Gemini Api
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate an interesting post for platform Like LinkedIn on ${keywords}. Do not include the top sentence "Here is the content..", just directly start with the content`,
  });
  const htmlContent = marked.parse(response.text);
  // Generate image using keywords
  const image_url = await generateImage(keywords);

  res
    .status(200)
    .send({
      content: htmlContent,
      image_url: image_url.secure_url,
      public_id: image_url.public_id,
    });
});

// Store the ai generated image to database
router.post("/save", async (req, res) => {
  const { content, image_url, user_id, public_id } = req.body;
  const post = new Post({
    content: content,
    author: user_id,
  });

  post.images.push({ url: image_url, public_id });
  await post.save();
  console.log(post);
  res.send(post);
});

module.exports = router;
