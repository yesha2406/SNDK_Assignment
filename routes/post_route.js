var express = require('express');
var router = express.Router();

const postController = require("../controllers/post_controller");
const Auth = require("../middleware/auth_middleware");
const FileUpload = require("../utils/fileUpload");

/* Post Routes */
// create Post route
router.post('/', Auth.isAuthenticated, FileUpload.upload.single("image"), postController.createPost);

// get all Post route
router.get('/', Auth.isAuthenticated, postController.getAllPosts);

//get a Post by ID route
router.get('/:post_id', Auth.isAuthenticated, postController.getPostById);

//delete a Post by ID route
router.delete('/:post_id', Auth.isAuthenticated, postController.deletePostById);

//delete a Post by ID route
router.put('/:post_id', Auth.isAuthenticated, FileUpload.upload.single("image"), postController.updatePostById);

module.exports = router;
