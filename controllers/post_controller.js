const { Validator } = require("node-input-validator");

const Post = require("../schemas/post_schema");

// Create Post API
exports.createPost = async (req, res) => {
    try {
        let valid = new Validator(req.body, {
            name: "required",
            description: "required",
            category_id: "required",
        });
        let matched = await valid.check();
        if (!matched) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: valid.errors,
            });
        }

        let exist_post = await Post.findOne({ name: req.body.name });
        if (exist_post) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Post already exists with this name",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Attachment Not Found,Please Check the Attachment",
            });
        }

        req.baseUrl = req.protocol + '://' + req.get('Host');
        req.filepath = `${req.baseUrl}/${req.file.destination.split('public/')[1]}/${req.file.filename}`;

        const new_post = new Post({
            name: req.body.name,
            description: req.body.description,
            category_id: req.body.category_id,
            user_id: req.signedInUser,
            image: req.filepath,
        });
        const post = await new_post.save();
        if (!post) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Unable to save the data.",
            });
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Post added successfully",
            data: {
                _id: post._id,
                name: post.name,
                description: post.description,
                category_id: post.category_id,
                user_id: post.user_id,
                image: post.image,
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

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {

        let post_pipeline = [
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user'
                }
            },
            {
                '$lookup': {
                    'from': 'categories',
                    'localField': 'category_id',
                    'foreignField': '_id',
                    'as': 'category'
                }
            },
            {
                '$unwind': {
                    'path': '$user'
                }
            },
            {
                '$unwind': {
                    'path': '$category'
                }
            },
            {
                '$project': {
                    '_id': 1,
                    'name': 1,
                    'description': 1,
                    'image': 1,
                    'created_at': 1,
                    'updated_at': 1,
                    'user_id': 1,
                    'user_name': '$user.name',
                    'user_email': '$user.email',
                    'category_id': 1,
                    'category_name': '$category.name',
                    'created_at': 1,
                    'updated_at': 1,
                }
            },
            {
                '$match': {}
            },
            {
                '$skip': {}
            },
            {
                '$limit': {}
            },
        ];

        if (req.query.search) {
            post_pipeline[5]["$match"] = {
                $or: [
                    { _id: req.query.search },
                    { name: { "$regex": req.query.search, "$options": 'i' } },
                    { description: { "$regex": req.query.search, "$options": 'i' } },
                    { category_id: req.query.search },
                    { category_name: { "$regex": req.query.search, "$options": 'i' } },
                    { user_id: req.query.search },
                    { user_email: { "$regex": req.query.search, "$options": 'i' } },
                    { user_name: { "$regex": req.query.search, "$options": 'i' } },
                ],
            }
        }

        let limit;
        if (req.query.perPage) {
            limit = parseInt(req.query.perPage);
            post_pipeline[7]["$limit"] = limit;
        } else {
            limit = 10;
            post_pipeline[7]["$limit"] = limit;
        }

        let skip_data;
        if (req.query.page && req.query.page > 0) {
            skip_data = (req.query.page - 1) * limit;
            post_pipeline[6]["$skip"] = skip_data;
        } else {
            skip_data = (1 - 1) * limit;
            post_pipeline[6]["$skip"] = skip_data;
        }

        const posts = await Post.aggregate(post_pipeline);

        if (!posts) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Posts are not found",
            });
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "All Posts",
            count: posts.length,
            data: posts,
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}

// Get a post by ID
exports.getPostById = async (req, res) => {
    try {
        const post_id = req.params.post_id
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Post",
            data: post
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}

// delete a post by ID
exports.deletePostById = async (req, res) => {
    try {
        const post_id = req.params.post_id
        const post = await Post.findByIdAndDelete({ _id: post_id });
        if (!post) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Post deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}

// delete a post by ID
exports.updatePostById = async (req, res) => {
    try {
        const post_id = req.params.post_id;
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Post not found",
            });
        }

        let image_path;
        if (req.file) {
            req.baseUrl = req.protocol + '://' + req.get('Host');
            req.filepath = `${req.baseUrl}/${req.file.destination.split('public/')[1]}/${req.file.filename}`;
            image_path = req.filepath;
        } else {
            image_path = post.image;
        }

        const update_query = {
            name: req.body.name,
            description: req.body.description,
            category_id: req.body.category_id,
            user_id: req.signedInUser,
            image: image_path,
        }

        const exist_post = await Post.findOne({ name: req.body.name });
        if (!exist_post) {
            await Post.findByIdAndUpdate({ _id: post_id }, update_query);
            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Post updated successfully",
                data: {
                    _id: post_id,
                    ...update_query
                }
            });
        }

        if (post._id && post.name == exist_post.name) {
            await Post.findByIdAndUpdate({ _id: post_id }, update_query);
            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Post updated successfully",
                data: {
                    _id: post_id,
                    ...update_query
                }
            });
        }

        return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "Post already existed",
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}

function select_query(data) {
    const query = {
        find_params: {},
        project_params: {},
        query_options: {}
    };

    if (req.query) {
        query.find_params = {
            $or: [
                { "category_id.name": { "$regex": data.query.search, "$options": 'i' } },
                { "user_id.name": { "$regex": data.query.search, "$options": 'i' } }
            ]
        }
    }

    return query;
}