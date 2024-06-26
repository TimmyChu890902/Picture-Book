const Post = require('../models/Post');

exports.createNewPost = async (req, res, next) => {
    let { 
        user_id,
        title,
        story_category } = req.body;
    try {
        let post = new Post(user_id,
            title,
            story_category
        );
        post = await post.save();
        res.status(201).json({ message: "Post created successfully", post_id: post });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
}

//delete post 確定detail也會被刪掉 ok
exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.post_id; // 從請求參數中獲取 post_id
        const affectedRows = await Post.deleteByPostId(postId);
        
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Post deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Post not found.' });
        }
    } catch (error) {
        next(error); // 將錯誤傳遞給下一個中間件（如錯誤處理器）
    }
};

exports.likePost = async (req, res, next) => {
    try {
        const postId = req.params.post_id;
        const posts = await Post.findByPostId(postId);

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const post = posts[0];
        const newLikesCount = post.likes_count + 1;

        const result = await Post.updateLikesCount(postId, newLikesCount);

        if (result > 0) {
            res.status(200).json({ message: 'Post liked successfully.', likes_count: newLikesCount });
        } else {
            res.status(500).json({ message: 'Failed to update post.' });
        }
    } catch (error) {
        next(error); 
    }
};
exports.getByPostID = async (req, res, next) => {
    try {
        const postId = req.params.post_id; 
        const userPosts = await Post.getByPostId(postId);
        
        if (userPosts.length > 0) {
            res.status(200).json({ message: 'User posts retrieved successfully.', userPosts });
        } else {
            res.status(404).json({ message: 'No posts found for this user.' });
        }
    } catch (error) {
        next(error); 
    }
};
exports.getUserAllPost = async (req, res, next) => {
    try {
        const userId = req.params.user_id; 
        const pub = req.params.p; 
        const userPosts = await Post.findByUserId(userId,pub);
        
        if (userPosts.length > 0) {
            res.status(200).json({ message: 'User posts retrieved successfully.', userPosts });
        } else {
            res.status(404).json({ message: 'No posts found for this user.' });
        }
    } catch (error) {
        next(error); 
    }
};


exports.sorted = async (req, res, next) => {
    try {
        const catgory = req.query.sortedBycatgory;
        const sortway = req.query.sortedByway;
        const descorasc = req.query.DESCorASC || "DESC";
        
        let posts;
        if(catgory && sortway){
            posts = await Post.findcategoryandway(catgory, sortway, descorasc);
        } else if(catgory){
            posts = await Post.findcategory(catgory);
        } else if(sortway){
            posts = await Post.findAllSorted(sortway, descorasc);
        } else {
            posts = await Post.findAll();
        }

        if (posts.length > 0) {
            res.status(200).json({ message: 'Posts sorted successfully.', posts });
        } else {
            res.status(404).json({ message: 'No such posts Category' });
        }
    } catch (error) {
        next(error);
    }
};

exports.getUserIdByPostId = async (req, res, next) => {
    try {
        const postId = req.params.post_id;
        const userId = await Post.findUserIdByPostId(postId);

        if (userId) {
            res.status(200).json({ user_id: userId });
        } else {
            res.status(404).json({ message: 'Post not found.' });
        }
    } catch (error) {
        next(error);
    }
};
exports.modifyPost = async (req, res, next) => {
    try {
        const postId = req.params.post_id; 
        const updateData = req.body; 
        const affectedRows = await Post.updatePost(postId, updateData);
        
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Post modified successfully.' });
        } else {
            res.status(404).json({ message: 'Post not found.' });
        }
    } catch (error) {
        next(error); 
    }
};

exports.changePublish = async (req, res, next) => {
    try {
        const postId = req.params.post_id; 
        
        const affectedRows = await Post.updatePublish(postId);
        
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Publish status modified successfully.' });
        } else {
            res.status(404).json({ message: 'Publish not found.' });
        }
    } catch (error) {
        next(error); 
    }
};