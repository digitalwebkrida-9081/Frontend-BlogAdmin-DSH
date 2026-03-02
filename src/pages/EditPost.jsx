import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Form.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    focusKeyword: "",
    altText: "",
    schemaMarkup: "",
    status: "draft",
    imageUrl: "",
    category: "Uncategorized",
    author: "Admin",
    readTime: "5 min read",
    excerpt: "",
    featured: false,
    gradient: "from-blue-600 to-indigo-600",
    icon: "📄",
    showCta: false,
    ctaText:
      "Need Custom Data? Get high-quality scraped data tailored to your business needs.",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `https://stagservice.datasellerhub.com/api/posts/${id}`,
        );
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await axios.post(
        "https://stagservice.datasellerhub.com/api/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setFormData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed.");
    }
  };

  const handleInsertLink = () => {
    const textarea = document.getElementById("content-textarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end) || "Link Text";
    const url = window.prompt("Enter link URL:", "https://");
    if (!url) return;
    const textBefore = formData.content.substring(0, start);
    const textAfter = formData.content.substring(end);
    setFormData({
      ...formData,
      content: textBefore + `[${selectedText}](${url})` + textAfter,
    });
  };

  const handleInsertBold = () => {
    const textarea = document.getElementById("content-textarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end) || "bold text";
    const textBefore = formData.content.substring(0, start);
    const textAfter = formData.content.substring(end);
    setFormData({
      ...formData,
      content: textBefore + `**${selectedText}**` + textAfter,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://stagservice.datasellerhub.com/api/posts/${id}`,
        formData,
      );
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update post.";
      alert(errorMessage);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;

  return (
    <div className="form-container">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Featured Image Upload</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {formData.imageUrl && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={formData.imageUrl}
                alt="Uploaded preview"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Content *</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={handleInsertBold}
                style={{
                  padding: "2px 8px",
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                B
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                style={{
                  padding: "2px 8px",
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                🔗 Link
              </button>
            </div>
          </label>
          <textarea
            id="content-textarea"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
          ></textarea>
          <small
            style={{ color: "#6b7280", marginTop: "4px", display: "block" }}
          >
            Select text and click the buttons above to format. Or use **text**
            for bold, and [Link Text](https://example.com) for links.
          </small>
        </div>

        <div className="form-group">
          <label>Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Meta Keywords</label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords || ""}
            onChange={handleChange}
            placeholder="Comma separated keywords"
          />
        </div>

        <div className="form-group">
          <label>Canonical URL</label>
          <input
            type="url"
            name="canonicalUrl"
            value={formData.canonicalUrl || ""}
            onChange={handleChange}
            placeholder="https://example.com/original-article"
          />
        </div>

        <div className="form-group">
          <label>Focus Keyword</label>
          <input
            type="text"
            name="focusKeyword"
            value={formData.focusKeyword || ""}
            onChange={handleChange}
            placeholder="Main SEO keyword"
          />
        </div>

        <div className="form-group">
          <label>Image Alt Text</label>
          <input
            type="text"
            name="altText"
            value={formData.altText || ""}
            onChange={handleChange}
            placeholder="Describe the featured image for SEO"
          />
        </div>

        <div className="form-group">
          <label>Schema Markup (JSON-LD)</label>
          <textarea
            name="schemaMarkup"
            value={formData.schemaMarkup || ""}
            onChange={handleChange}
            rows="4"
            placeholder='{ "@context": "https://schema.org", "@type": "BlogPosting", ... }'
          ></textarea>
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Read Time</label>
          <input
            type="text"
            name="readTime"
            value={formData.readTime || ""}
            onChange={handleChange}
            placeholder="e.g. 5 min read"
          />
        </div>
        <div className="form-group">
          <label>Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt || ""}
            onChange={handleChange}
            rows="2"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Gradient</label>
          <input
            type="text"
            name="gradient"
            value={formData.gradient || ""}
            onChange={handleChange}
            placeholder="e.g. from-blue-600 to-indigo-600"
          />
        </div>
        <div className="form-group">
          <label>Icon (Emoji)</label>
          <input
            type="text"
            name="icon"
            value={formData.icon || ""}
            onChange={handleChange}
          />
        </div>
        <div
          className="form-group"
          style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}
        >
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured || false}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            style={{ width: "auto" }}
          />
          <label style={{ marginBottom: 0 }}>Featured Post</label>
        </div>

        <div
          className="form-group"
          style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}
        >
          <input
            type="checkbox"
            name="showCta"
            checked={formData.showCta || false}
            onChange={(e) =>
              setFormData({ ...formData, showCta: e.target.checked })
            }
            style={{ width: "auto" }}
          />
          <label style={{ marginBottom: 0 }}>
            Add CTA Section in Middle of Blog
          </label>
        </div>

        {formData.showCta && (
          <div
            className="form-group"
            style={{
              paddingLeft: "20px",
              borderLeft: "4px solid #3b82f6",
              marginTop: "-10px",
              marginBottom: "20px",
            }}
          >
            <label>CTA Text</label>
            <textarea
              name="ctaText"
              value={formData.ctaText || ""}
              onChange={handleChange}
              rows="3"
            ></textarea>
            <small style={{ color: "#6b7280" }}>
              Default text is provided above.
            </small>
          </div>
        )}

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Update Post
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
