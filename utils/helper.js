const totalLikes = (blogs) => {
  const likes = blogs.reduce(
    (accumulator, currentValue) => accumulator + currentValue.likes,
    0
  );

  return likes;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.sort((a, b) => b.likes - a.likes);

  return favorite[0];
};

const mostBlogs = (blogs) => {
  const blogCount = {};

  blogs.forEach((blog) => {
    const author = blog.author;

    if (blogCount[author]) {
      blogCount[author]++;
    } else {
      blogCount[author] = 1;
    }
  });

  let maxAuthor = null;
  let maxBlogs = 0;

  for (const author in blogCount) {
    if (blogCount[author] > maxBlogs) {
      maxBlogs = blogCount[author];
      maxAuthor = author;
    }
  }

  return { author: maxAuthor, blogs: maxBlogs };
};

const mostLikes = (blogs) => {
  const blogCount = {};

  blogs.forEach((blog) => {
    const author = blog.author;

    if (blogCount[author]) {
      blogCount[author] += blog.likes;
    } else {
      blogCount[author] = blog.likes;
    }
  });

  let maxAuthor = null;
  let maxLikes = 0;

  for (const author in blogCount) {
    if (blogCount[author] > maxLikes) {
      maxLikes = blogCount[author];
      maxAuthor = author;
    }
  }

  return { author: maxAuthor, likes: maxLikes };
};

export { totalLikes, favoriteBlog, mostBlogs, mostLikes };
