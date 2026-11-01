import { translate } from '../utils/translations';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getBlogPosts } from '../services/rssService';
import '../styles/blog.css';

export default function Blog() {
  const language = useSelector((state) => state.language);
  const t = (text) => translate(text, language);
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadBlog() {
      try {
        const posts = await getBlogPosts();
        if (active) setBlogList(posts);
      } catch (error) {
        if (active) setError(error.message || 'Không tải được bài viết.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadBlog();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="blog-page">
      <p className="page-eyebrow">SHOE STORE JOURNAL</p>
      <h1>{t("Chuyện về giày")}</h1>
      <p className="page-intro">{t("Chọn đôi giày phù hợp. Tìm phong cách của riêng bạn.")}</p>
      {loading && <p role="status">{t("Đang tải bài viết...")}</p>}
      {error && (
        <p role="alert" className="page-error">
          {t(error)}
        </p>
      )}
      {!loading && !error && blogList.length === 0 && <p>{t("Chưa có bài viết.")}</p>}
      <div className="blog-grid">
        {blogList.map((post, index) => (
          <article className="blog-card" key={post.id}>
            <div className="blog-card-top">
              <span>{t(post.category)}</span>
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <h2>
              <Link to={`/blog/${encodeURIComponent(post.id)}`}>
                {post.title}
              </Link>
            </h2>
            <p>
              {post.description.length > 170
                ? post.description.slice(0, 170) + '…'
                : post.description}
            </p>
            <div className="blog-card-bottom">
              <span>
                {!Number.isNaN(Date.parse(post.pubDate))
                  ? new Date(post.pubDate).toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN')
                  : t('Chưa có ngày đăng')}
              </span>
              <Link
                to={`/blog/${encodeURIComponent(post.id)}`}
                aria-label={`${language === 'en' ? 'Read article' : 'Đọc bài'}: ${post.title}`}
              >{t("Đọc bài →")}</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
