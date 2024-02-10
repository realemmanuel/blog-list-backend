import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import Blog from "../models/blog.js";
import { nonExistingId, blogsInDb, initialBlogList } from "./test-helper.js";

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogList) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
}, 100000);

describe("when there is initially some blogs saved", () => {
  test("Blogs are returned as json", async () => {
    console.log("entered test");
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogList.length);
  }, 100000);

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const author = response.body.map((r) => r.author);

    expect(author).toContain("Clifford Mapesa");
  }, 100000);
});

describe("viewing a specific blog", () => {
  test("a specific blog can be viewed", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    console.log("Result View", resultBlog.body);
    console.log("Blog to view", blogToView);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test("fails with statuscode 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("addition of a new blog", () => {
  test("succeeds with valid data", async () => {
    const newBlog = {
      title: "Control flow in Rust",
      author: "Francesco Ciulla",
      url: "https://blog.francescociulla.com/control-flow-in-rust",
      likes: 29,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogList.length + 1);

    const contents = blogsAtEnd.map((b) => b.title);
    expect(contents).toContain("Control flow in Rust");
  });

  test("fails with status code 400 if data invalid", async () => {
    const newBlog = {
      author: "Kevin Koech",
      url: "https://kevinkoech357.hashnode.dev/introduction-to-object-oriented-programming-oop-in-python",
      likes: 9,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await blogsInDb();

    expect(blogsAtEnd).toHaveLength(initialBlogList.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogList.length - 1);

    const contents = blogsAtEnd.map((r) => r.title);

    expect(contents).not.toContain(blogToDelete.content);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("updating of a blog", () => {
  test("suceeds with status code 201 if blog is updated successfully", async () => {
    const allBlogs = await blogsInDb();
    const firstBlog = allBlogs[0];

    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(initialBlogList[0])
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const updatedBlog = allBlogs.find((blog) => blog.id === firstBlog.id);

    expect(updatedBlog.title).toEqual(initialBlogList[0].title);
    expect(updatedBlog.author).toEqual(initialBlogList[0].author);
    expect(updatedBlog.url).toEqual(initialBlogList[0].url);
    expect(updatedBlog.likes).toEqual(initialBlogList[0].likes);
  });
});
