import Blog from "../models/blog.js";
import User from "../models/user.js";

const initialBlogList = [
  {
    title: "How to Make an Animated Search Bar with using only HTML and CSS",
    author: "Alteca",
    url: "https://alteca.hashnode.dev/how-to-make-an-animated-search-bar-with-using-only-html-and-css",
    likes: 7,
  },
  {
    title: "Bit manipulation in C",
    author: "Clifford Mapesa",
    url: "https://cliffordmapesa.hashnode.dev/bit-manipulation-in-c",
    likes: 16,
  },
];

const nonExistingId = async () => {
  const note = new Blog({ title: "willremovethissoon" });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

const blogsInDb = async () => {
  try {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
  } catch (error) {
    throw new Error();
  }
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

export { nonExistingId, blogsInDb, usersInDb, initialBlogList };
