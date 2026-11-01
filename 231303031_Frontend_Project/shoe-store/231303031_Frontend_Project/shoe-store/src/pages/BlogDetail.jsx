import { translate } from '../utils/translations';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getBlogPosts } from '../services/rssService';
import '../styles/blog.css';

export default function BlogDetail() {
  const language = useSelector((state) => state.language);
  const t = (text) => translate(text, language);
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
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <article className="blog-detail">
      <Link className="blog-back" to="/blog">{t("← Trở về Blog")}</Link>
      {loading ? (
        <p role="status">{t("Đang tải bài viết...")}</p>
      ) : error ? (
        <p className="page-error" role="alert">
          {t(error)}
        </p>
      ) : !post ? (
        <>
          <h1>{t("Không tìm thấy bài viết")}</h1>
          <p>{t("Bài viết không tồn tại hoặc đã được thay đổi.")}</p>
        </>
      ) : (
        <>
          <p className="page-eyebrow">{t(post.category)}</p>
          <h1>{post.title}</h1>
          <p className="blog-meta">
            {!Number.isNaN(Date.parse(post.pubDate))
              ? new Date(post.pubDate).toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN')
              : t('Chưa có ngày đăng')}{' '}
            · Shoe Store
          </p>
          <div className="blog-content">
            {post.description ? (
              post.description
                .split(/\n\s*\n/)
                .map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{t("Bài viết chưa có nội dung.")}</p>
            )}
          </div>
        </>
      )}
    </article>
  );
}
