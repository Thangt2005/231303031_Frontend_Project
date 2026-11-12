import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { getBlogPosts } from '../../services/rssService';
import '../../styles/blog-detail.css';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  pubDate: string;
};

function renderContent(content: string) {
  const doc = new DOMParser().parseFromString(content, 'text/html');
  const elements = doc.body.children;
  const result: ReactNode[] = [];

  if (elements.length === 0) {
    result.push(<p key={0}>{content}</p>);
    return result;
  }

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const tag = element.tagName.toLowerCase();
    const text = (element.textContent || '').trim();

    if (text === '') {
      continue;
    }

    if (tag === 'h2') {
      result.push(<h2 key={i}>{text}</h2>);
    } else if (tag === 'h3') {
      result.push(<h3 key={i}>{text}</h3>);
    } else if (tag === 'p' || tag === 'div') {
      result.push(<p key={i}>{text}</p>);
    } else if (tag === 'ul' || tag === 'ol') {
      const liList = element.getElementsByTagName('li');
      const items: ReactNode[] = [];

      for (let j = 0; j < liList.length; j++) {
        items.push(<li key={j}>{(liList[j].textContent || '').trim()}</li>);
      }

      if (tag === 'ul') {
        result.push(<ul key={i}>{items}</ul>);
      } else {
        result.push(<ol key={i}>{items}</ol>);
      }
    }
  }

  return result;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('vi-VN');
}

export default function BlogDetail() {
  const { slug } = useParams();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Bỏ kết quả cũ nếu người dùng đã chuyển sang bài khác
    let ignore = false;

    async function loadBlog() {
      setLoading(true);
      setError('');

      try {
        const blogList: BlogPost[] = await getBlogPosts();
        const found = blogList.find((item) => item.slug === slug);

        if (!ignore) {
          setBlog(found || null);
        }
      } catch (err) {
        console.log(err);

        if (!ignore) {
          setError('Không tải được bài viết.');
        }
      }

      if (!ignore) {
        setLoading(false);
      }
    }

    loadBlog();

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="blog-detail">
        <p>Đang tải bài viết...</p>
      </section>
    );
  }

  if (error !== '') {
    return (
      <section className="blog-detail">
        <p>{error}</p>
        <Link to="/blog">Quay lại Blog</Link>
      </section>
    );
  }

  if (blog === null) {
    return (
      <section className="blog-detail">
        <h1>Không tìm thấy bài viết</h1>
        <p>Bài viết không tồn tại hoặc đường dẫn không đúng.</p>
        <Link to="/blog">Quay lại Blog</Link>
      </section>
    );
  }

  const date = formatDate(blog.pubDate);

  return (
    <article className="blog-detail">
      <Link to="/blog" className="blog-detail-back">
        ← Quay lại Blog
      </Link>

      <header className="blog-detail-header">
        <p className="blog-detail-category">{blog.category}</p>
        <h1>{blog.title}</h1>
        <p className="blog-detail-info">
          {blog.author} {date !== '' && <span>· {date}</span>}
        </p>
      </header>

      <div className="blog-detail-content">
        {renderContent(blog.content || blog.description)}
      </div>
    </article>
  );
}
