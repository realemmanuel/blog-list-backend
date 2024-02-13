import express from "express";
import Blog from "../models/blog.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const blogRouter = express.Router();

export const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization ?? authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

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

blogRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body.title || !body.author || !body.url || !body.likes) {
    return response.status(400).json({
      error: "Name, Author, Url, Likes may be missing",
    });
  }

  const existingBlog = await Blog.findOne({ title: body.title });
  if (existingBlog) {
    return response.status(400).json({
      error: "Name Already Exists",
    });
  }

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
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
