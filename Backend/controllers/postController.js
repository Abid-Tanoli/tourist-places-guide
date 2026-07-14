import Post from "../models/Post.js";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const getPosts = async (req, res, next) => {
  try {
    const { status, tag, page = 1, limit = 20 } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (tag) filters.tags = tag;

    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      Post.find(filters)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-__v"),
      Post.countDocuments(filters),
    ]);

    res.json({
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPublishedPosts = async (req, res, next) => {
  try {
    const { tag, page = 1, limit = 20 } = req.query;
    const filters = { status: "published" };
    if (tag) filters.tags = tag;

    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      Post.find(filters)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-__v -content"),
      Post.countDocuments(filters),
    ]);

    res.json({
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).select("-__v");
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const allowedPostFields = ["title", "slug", "excerpt", "content", "coverImage", "author", "tags", "status", "publishedAt"];

const pickAllowed = (body, fields) =>
  fields.reduce((obj, key) => {
    if (body[key] !== undefined) obj[key] = body[key];
    return obj;
  }, {});

export const createPost = async (req, res, next) => {
  try {
    const postData = pickAllowed(req.body, allowedPostFields);
    if (!postData.slug && postData.title) {
      let slug = slugify(postData.title);
      const existing = await Post.findOne({ slug });
      if (existing) slug = `${slug}-${Date.now()}`;
      postData.slug = slug;
    }
    if (postData.status === "published" && !postData.publishedAt) {
      postData.publishedAt = new Date();
    }
    const post = await Post.create(postData);
    res.status(201).json(post);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A post with this slug already exists." });
    }
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const updateData = pickAllowed(req.body, allowedPostFields);
    if (updateData.title && !updateData.slug) {
      updateData.slug = slugify(updateData.title);
    }
    if (updateData.status === "published" && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }
    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.json(post);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A post with this slug already exists." });
    }
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.json({ message: "Post deleted." });
  } catch (error) {
    next(error);
  }
};
