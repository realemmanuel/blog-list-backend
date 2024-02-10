import express from "express";
import Blog from "../models/blog.js";

const blogRouter = express.Router();

blogRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    response.status(404).send({ error: error });
  }
});

blogRouter.post("/post", async (request, response, next) => {
  try {
    const body = request.body;

    if (!body.title || !body.author || !body.url || !body.likes) {
      return response.status(400).json({
        error: "Name or Number missing",
      });
    }

    const existingBlog = await Blog.findOne({ title: body.title });
    if (existingBlog) {
      return response.status(400).json({
        error: "Name Already Exists",
      });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

export { blogRouter };
