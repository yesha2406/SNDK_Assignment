const { Validator } = require("node-input-validator");

const Category = require("../schemas/category_schema");

// Create Category API
exports.createCategory = async (req, res) => {
    try {
        let valid = new Validator(req.body, {
            name: "required"
        });
        let matched = await valid.check();
        if (!matched) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: valid.errors,
            });
        }

        let exist_category = await Category.findOne({ name: req.body.name });
        if (exist_category) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Category already exists with this name",
            });
        }

        const new_category = new Category({
            name: req.body.name,
            created_by: req.signedInUser,
            updated_by: req.signedInUser,
        });
        const category = await new_category.save();
        if (!category) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Unable to save the data.",
            });
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Category added successfully",
            data: {
                _id: category._id,
                name: category.name
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        if (!categories) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Categories not found",
            });
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "All categories",
            data: categories
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category_id = req.params.category_id
        const category = await Category.findOne({ _id: category_id });
        if (!category) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Category not found",
            });
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Category",
            data: category
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}

// delete a category by ID
exports.deleteCategoryById = async (req, res) => {
    try {
        const category_id = req.params.category_id
        const category = await Category.findByIdAndDelete({ _id: category_id });
        if (!category) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Category not found",
            });
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Category deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}

// delete a category by ID
exports.updateCategoryById = async (req, res) => {
    try {
        const category_id = req.params.category_id;

        const category = await Category.findOne({ _id: category_id });
        if (!category) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Category not found",
            });
        }

        const update_query = {
            name: req.body.name,
            updated_by: req.signedInUser
        }

        const exist_category = await Category.findOne({ name: update_query.name });
        if (!exist_category) {
            await Category.findByIdAndUpdate({ _id: category_id }, update_query);
            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Category updated successfully",
                data: {
                    _id: category_id,
                    ...update_query
                }
            });
        }

        if (category._id && category.name == exist_category.name) {
            await Category.findByIdAndUpdate({ _id: category_id }, update_query);
            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Category updated successfully",
                data: {
                    _id: category_id,
                    ...update_query
                }
            });
        }

        return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "Category already exists.",
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}