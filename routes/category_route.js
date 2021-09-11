var express = require('express');
var router = express.Router();

const categoryController = require("../controllers/category_controller");
const Auth = require("../middleware/auth_middleware");

/* Category Routes */
// create Category route
router.post('/', Auth.isAuthenticated, categoryController.createCategory);

// get all categories route
router.get('/', Auth.isAuthenticated, categoryController.getAllCategories);

//get a category by ID route
router.get('/:category_id', Auth.isAuthenticated, categoryController.getCategoryById);

//delete a category by ID route
router.delete('/:category_id', Auth.isAuthenticated, categoryController.deleteCategoryById);

//delete a category by ID route
router.put('/:category_id', Auth.isAuthenticated, categoryController.updateCategoryById);

module.exports = router;
