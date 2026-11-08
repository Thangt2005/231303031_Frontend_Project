import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

export function Error() {
  const error = useRouteError();

  let title = 'Oops! Đã xảy ra lỗi.';
  let message = 'Đường dẫn không hợp lệ hoặc dữ liệu không tồn tại.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = typeof error.data === 'string' ? error.data : message;
  } else if (error instanceof globalThis.Response) {
    title = `${error.status} ${error.statusText}`;
    message = error.status === 404 ? 'Không tìm thấy sản phẩm.' : message;
  } else if (error instanceof globalThis.Error) {
    message = error.message;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#f6f6f6',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '480px' }}>
        <h1 style={{ marginBottom: '12px', color: '#b3261e', fontSize: '28px' }}>{title}</h1>
        <p style={{ marginBottom: '24px', color: '#555', lineHeight: 1.6 }}>{message}</p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            borderRadius: '6px',
            background: '#17654e',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default Error;
