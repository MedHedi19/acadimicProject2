const express = require("express");
const router = express.Router();
const postController = require("../controllers/postControllers");
const { checkAuth, checkGymStaff } = require('../middleware/verifyToken');

router.post("/createPost", checkAuth, checkGymStaff, postController.createPost);
router.get("/getPosts/", checkAuth, postController.getPosts);
router.delete("/deletePost/:postId", checkAuth, checkGymStaff, postController.deletePost);

module.exports = router;
