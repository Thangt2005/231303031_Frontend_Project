import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getBlogPosts } from '../services/rssService';
import '../styles/blog.css';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setPost(null);
    async function loadPost() {
      try {
        const posts = await getBlogPosts();
        if (active) setPost(posts.find((item) => item.id === slug) || null);
      } catch (error) {
        if (active) setError(error.message || 'Không tải được bài viết.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPost();
    return () => { active = false; };
  }, [slug]);

  return (
    <article className="blog-detail">
      <Link className="blog-back" to="/blog">← Trở về Blog</Link>
      {loading ? <p role="status">Đang tải bài viết...</p> : error ? <p className="page-error" role="alert">{error}</p> : !post ? (
        <><h1>Không tìm thấy bài viết</h1><p>Bài viết không tồn tại hoặc đã được thay đổi.</p></>
      ) : (
        <>
          <p className="page-eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="blog-meta">{!Number.isNaN(Date.parse(post.pubDate)) ? new Date(post.pubDate).toLocaleDateString('vi-VN') : 'Chưa có ngày đăng'} · Shoe Store</p>
          <div className="blog-content">
            {post.description ? post.description.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>Bài viết chưa có nội dung.</p>}
          </div>
        </>
      )}
    </article>
  );
}
