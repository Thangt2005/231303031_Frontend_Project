# Shoe Store — phần C tuần 1

Bản React dùng JavaScript/JSX, CSS, Vite và React Router.

## Chạy dự án

Mở terminal trong thư mục shoe-store:

```sh
npm ci
npm run dev
```

Đã kiểm tra với Node.js 24.11.1. Mở URL Vite in ra để xem bản chạy thử.

## Kiểm tra

```sh
npm test
npm run build
```

## Các file phần C

- src/components/Header.jsx: logo và menu điều hướng.
- src/components/Footer.jsx: chân trang dùng chung.
- src/layouts/Layout.jsx: Header, main chứa Outlet và Footer.
- src/styles/layout.css: CSS của khung chung, có bố cục cho màn hình hẹp.
- public/blog.xml: 6 bài viết mẫu RSS 2.0.
- src/services/rssService.js: tải XML và chuyển các item thành mảng object bằng DOMParser.
- tests/rssService.test.mjs: kiểm tra dữ liệu và xử lý lỗi service.

## Cách hoạt động

NavLink đánh dấu mục menu đang mở. Outlet hiển thị nội dung route con trong khung chung. Service dùng fetch để tải chuỗi XML, DOMParser để đọc các thẻ, Array.from và map để chuyển thành mảng bài viết. Lỗi HTTP, XML không hợp lệ, thiếu tiêu đề hoặc trùng mã được báo cho nơi gọi.

## Phạm vi và tích hợp

Thư mục demo chứa router và trang mẫu để chạy thử phần C. Nút Kiểm tra đọc blog.xml phải báo đọc thành công 6 bài. Đây chưa phải trang chủ, danh sách Blog, đăng nhập, sản phẩm hay giỏ hàng hoàn chỉnh.

Các file HTML/CSS/JS cũ của nhóm vẫn được giữ lại; ứng dụng Vite chạy từ demo/main.jsx. Khi có source React chung, tích hợp các file phần C vào router của nhóm bằng route cha có element={<Layout />}, giữ một BrowserRouter. Thống nhất đường dẫn menu và phiên bản React Router trước khi ghép. Không chép đè router hoặc cấu hình của A/B bằng bản demo.

Chưa làm RSS ngoài, CORS/proxy và fallback tự động (tuần 2). Feed hiện hỗ trợ RSS 2.0 cơ bản, chưa hỗ trợ Atom. Nội dung description trả về dạng text; không đưa RSS ngoài trực tiếp vào dangerouslySetInnerHTML. Tên miền .example trong XML là dữ liệu minh họa.

## Kiểm tra đã thực hiện

- 8/8 bài kiểm thử service đạt.
- Build thành công.
- Bản nguồn đã được kiểm tra trên trình duyệt: 5 mục menu, tải lại /products, đọc đủ 6 bài XML; khung giao diện không tràn ngang ở chiều rộng 319px và 1280px.

## Cập nhật giao diện phần C

Header có logo, ô tìm kiếm giày, icon tài khoản/giỏ hàng và menu riêng. Ô tìm kiếm mới chỉ là giao diện, chưa kết nối dữ liệu sản phẩm. Footer chia ba cột. Demo đọc XML hiển thị 6 bài với tiêu đề bấm mở/đóng nội dung; không có tìm kiếm theo tiêu đề bài viết.
