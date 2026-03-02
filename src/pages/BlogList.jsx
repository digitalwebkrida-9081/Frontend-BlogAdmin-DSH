import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./BlogList.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        "https://stagservice.datasellerhub.com/api/posts",
      );
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(
          `https://stagservice.datasellerhub.com/api/posts/${id}`,
        );
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;

  return (
    <div className="blog-list-container">
      <div className="header-actions">
        <h1>All Blog Posts</h1>
        <Link to="/create" className="btn-primary">
          Add New Post
        </Link>
      </div>

      <div className="table-container">
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>
                  <span className={`status-badge ${post.status}`}>
                    {post.status}
                  </span>
                </td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/edit/${post._id}`} className="btn-action edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="btn-action delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No posts found. Create one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogList;
