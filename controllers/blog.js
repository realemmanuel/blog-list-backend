import express from "express";
import Blog from "../models/blog.js";

const blogRouter = express.Router();

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).end();
  }
  response.json(blog);
});

blogRouter.post("/post", async (request, response, next) => {
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
});

blogRouter.delete("/delete/:id", async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogRouter.put("/update/:id", async (request, response) => {
  const body = request.body;

  if (!body.title || !body.author || !body.url || !body.likes) {
    return response.status(400).json({
      error: "Name or Number missing",
    });
  }

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const update = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
    runValidators: true,
  });

  if (!update) {
    return response.status(404).json({ error: "Blog not found" });
  }

  response.status(201).json(update);
});

export { blogRouter };
