import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from '../src/layouts/Layout';
import { getBlogPosts } from '../src/services/rssService';
import './demo.css';

// Chỉ là nơi chạy thử phần C, không thay thế router và trang của A/B.
function DemoPage({ title }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);


  async function checkXml() {
    setLoading(true);
    setMessage('Đang đọc XML...');
    setPosts([]);
    setHasLoaded(false);
    try {
      const posts = await getBlogPosts();
      setPosts(posts);
      setHasLoaded(true);
      setMessage('Đọc thành công ' + posts.length + ' bài viết từ blog.xml.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="demo-panel">
      <p className="demo-label">DEMO PHẦN C · TUẦN 1</p>
      {title && <h1>{title}</h1>}
      <p>Header và Footer dùng chung</p>
      <p>Các chức năng mua hàng và trang Blog sẽ được tích hợp sau.</p>
      <button onClick={checkXml} disabled={loading}>
        {loading ? 'Đang đọc...' : 'Đọc lại XML'}
      </button>
      <p role="status">{message}</p>
      {!hasLoaded && !loading && <p>Bấm “Đọc lại XML” để tải danh sách bài viết.</p>}
      {hasLoaded && (
        <>
          <p>Danh sách {posts.length} bài viết:</p>
          {posts.length === 0 ? (
            <p>File XML chưa có bài viết.</p>
          ) : (
            <div className="demo-posts">
              {posts.map((post) => (
                <details className="demo-post" key={post.id}>
                  <summary>{post.title}</summary>
                  <p className="demo-post-category">{post.category}</p>
                  <div className="demo-post-content">
                    {post.description || 'Bài viết chưa có nội dung.'}
                  </div>
                </details>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DemoPage />} />
          <Route path="products" element={<DemoPage title="Sản phẩm" />} />
          <Route path="blog" element={<DemoPage title="Blog" />} />
          <Route path="cart" element={<DemoPage title="Giỏ hàng" />} />
          <Route path="login" element={<DemoPage title="Đăng nhập" />} />
          <Route path="*" element={<DemoPage title="Đường dẫn chưa có trong bản chạy thử" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);






