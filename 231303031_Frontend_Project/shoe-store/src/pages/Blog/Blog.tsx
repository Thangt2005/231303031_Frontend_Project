import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getBlogPosts } from '../../services/rssService';
import '../../styles/blog.css';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  category: string;
  author: string;
};

// Lấy phần chữ để hiển thị tóm tắt
function getSummary(description: string) {
  const document = new DOMParser().parseFromString(description, 'text/html');
  const text = (document.body.textContent || '').replace(/\s+/g, ' ').trim();
  return text.length > 180 ? text.slice(0, 180) + '...' : text;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('vi-VN');
}

export default function Blog() {
  const [blogList, setBlogList] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy danh sách bài viết khi mở trang
  useEffect(() => {
    let active = true;

    async function loadBlogs() {
      try {
        const data = await getBlogPosts();
        if (active) {
          setBlogList(data);
        }
      } catch (error) {
        if (active) {
          setError(error instanceof Error ? error.message : 'Không tải được bài viết.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    // Không cập nhật state nếu đã chuyển sang trang khác
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="blog-page">
      <h1>Blog về giày</h1>
      <p>Kinh nghiệm chọn giày, phối đồ và chăm sóc giày.</p>

      {loading && <p role="status">Đang tải bài viết...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && blogList.length === 0 && (
        <p>Chưa có bài viết nào.</p>
      )}

      {!loading && !error && (
        <div className="blog-list">
          {blogList.map((blog) => (
            <article className="blog-card" key={blog.id}>
              <p className="blog-category">{blog.category}</p>
              <h2>
                <Link to={`/blog/${encodeURIComponent(blog.slug)}`}>{blog.title}</Link>
              </h2>
              <p className="blog-info">
                {blog.author}
                {formatDate(blog.pubDate) && ' · ' + formatDate(blog.pubDate)}
              </p>
              <p>{getSummary(blog.description)}</p>
              <Link className="blog-read-more" to={`/blog/${encodeURIComponent(blog.slug)}`}>
                Đọc tiếp
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
