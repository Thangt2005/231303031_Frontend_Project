# Phần C – bản làm lại theo mẫu giao diện

## Mở đúng dự án

Thư mục ứng dụng:
E:\Shoe_Store\shoe-store-team\231303031_Frontend_Project\shoe-store

Mở thư mục này bằng WebStorm. Terminal:

    npm ci
    npm run dev

Mở URL Vite hiển thị. Không chạy npm ở E:\Shoe_Store vì thư mục đó còn repository cũ.

## Phạm vi và trạng thái

- Nền source: Master của nhóm, commit 54ac04e.
- Giao diện dựa trên ảnh Header/Footer người dùng gửi; chưa đọc được thông số thiết kế trong Figma. Các trang khác sử dụng cùng phong cách trắng, đen, xám và đỏ, không khẳng định khớp từng pixel với Figma.
- C1: Header/Footer/Layout mới. Đã build; lượt kiểm tra trước xác nhận menu mobile mở/đóng, chuyển Blog, không tràn ở 390 và 1440px tại thời điểm C1.
- C2: tái sử dụng 6 bài trong public/blog.xml; kiểm thử đạt.
- C3: tái sử dụng parser RSS 2.0 của nhóm; kiểm thử đạt.
- C4–C5: đã viết danh sách, chi tiết, loading/error/empty/not-found. Chờ kiểm tra trình duyệt đầy đủ.
- C6: fallback khi lỗi mạng/HTTP/XML/timeout. Test mô phỏng mạng/HTTP/XML và lỗi cả hai nguồn đạt. Chưa có URL RSS chính thức; chưa xác minh CORS hoặc timeout với nguồn thật.
- C7: trang chủ lấy dữ liệu qua productService và dùng ProductItems của B.
- C8: 404 có liên kết về trang chủ.
- C9: CSS Header/Footer, lưới sản phẩm có breakpoint. Chờ kiểm tra giao diện cuối trên nhiều kích thước.
- C10–C11: có CompareContext và /compare; giới hạn 3, chống trùng, xóa, trạng thái rỗng. Chờ kiểm thử tương tác bên dưới.
- C12: chỉ chuẩn bị Account.jsx nhận prop user. Đã kiểm tra Master, Hthang, Thang: chưa có AuthContext/ProtectedRoute. Chưa mở /account và chưa hoàn tất guard. Không dùng kiểm tra user trong component thay cho guard của A.
- C13: build và 10 test RSS đã đạt. Kiểm tra trình duyệt lần cuối bị chặn vì Local browser use bị tắt trong Work settings. Chưa đánh dấu toàn bộ Done.

## Kiến thức và luồng dữ liệu

Header dùng useState cho menu mobile. Nhấn menu đổi menuOpen; chọn đường dẫn đóng menu.
Layout đặt Header, Outlet và Footer; Router của A chọn nội dung hiển thị trong Outlet.
Blog dùng useEffect để tải dữ liệu một lần, useState lưu danh sách/loading/error; map tạo các thẻ bài.
BlogDetail lấy slug trên URL và tìm id tương ứng. Nội dung được hiển thị như text, không chèn HTML nguồn ngoài.
CompareProvider đặt quanh Layout để các trang dùng chung selectedProducts khi chuyển route. Thêm/xóa dùng setter dạng hàm để lấy State mới nhất. Không lưu localStorage vì Issue không yêu cầu; tải lại trình duyệt sẽ xóa lựa chọn.
Trang chủ tái sử dụng ProductItems và getProducts. Redux của B vẫn giữ nguyên.

## Tích hợp với A/B

AppRoutes chỉ bổ sung /blog/:slug và /compare. Không thay Router gốc hoặc trang A/B.
products.css chỉ đổi trình bày và breakpoint; không sửa dữ liệu hoặc ProductItems.
Header có link So sánh để truy cập chức năng C. Hàng mới/Thương hiệu/Sale là chữ tĩnh; tìm kiếm và yêu thích đang disabled vì phần B chưa được nối. Footer chỉ Blog có đường dẫn thực; các chính sách là nội dung mẫu, chưa tạo trang ngoài phân công.
Account cần A bàn giao AuthContext, cấu trúc user và cách dùng ProtectedRoute. Sau đó mới viết phần lấy user từ Context và đặt route bên trong guard. name/email hiện là props dự kiến, phải đối chiếu lại dữ liệu A.

## RSS và CORS

Mặc định đọc public/blog.xml. Khi có URL chính thức, sao chép .env.example thành .env.local rồi điền VITE_RSS_URL và khởi động lại Vite.
Trình duyệt chỉ cho đọc RSS khác nguồn khi máy chủ nguồn cho phép CORS. Không sửa được lỗi này bằng mode: no-cors vì không đọc được nội dung trả về. Nếu cần proxy phải thống nhất endpoint với nhóm và cấu hình cả môi trường triển khai; chưa có nguồn nên chưa thêm proxy tùy ý.
Mỗi lần fetch giới hạn 8 giây. RSS ngoài lỗi sẽ thử file nội bộ; nếu cả hai lỗi trang báo lỗi. Không dùng proxy công cộng ngẫu nhiên.

## Kiểm tra thủ công còn cần thực hiện

1. /blog: có 6 bài; bấm tiêu đề/Đọc bài mở đúng nội dung. Tải lại URL chi tiết vẫn hiển thị.
2. /blog/khong-co: báo không tìm thấy; nút trở về Blog hoạt động.
3. /compare: chưa chọn mà thêm phải báo chọn sản phẩm; thêm cùng một sản phẩm hai lần không tạo bản trùng.
4. Chọn 3 sản phẩm khác nhau; thêm sản phẩm thứ tư phải bị từ chối. Xóa một sản phẩm rồi thêm lại được.
5. Đi từ So sánh sang Blog bằng menu rồi trở lại So sánh: lựa chọn còn. Tải lại trang: lựa chọn về rỗng theo phạm vi State hiện tại.
6. Xóa hết: hiển thị bảng trống. Giá, hãng, màu, size khớp products.json.
7. /duong-dan-khong-co: có 404; quay về trang chủ được.
8. Kiểm tra 320, 390, 768, 1024, 1440px: Header không tràn, Footer xuống cột, sản phẩm đổi số cột; bảng so sánh chỉ cuộn ngang trong vùng bảng.
9. Console: phân biệt lỗi app với lỗi tải ảnh sản phẩm bên ngoài. Chưa xác minh độ ổn định các URL ảnh B cung cấp.
10. Khi A có Auth: chưa đăng nhập mở /account phải bị chuyển tới Login; đăng nhập xem đúng thông tin; đăng xuất không còn xem được Account.

## Git

Các nhánh Issue được tạo nối tiếp để bản cuối chứa các phần trước; không phải các PR độc lập cùng base Master. Nhánh hiện tại fix/c-final-checks chứa bản tổng hợp. Không merge từng nhánh mù quáng.
C2/C3 giữ code đúng từ Master, không tạo commit thay đổi giả. Đã tạo tên nhánh tương ứng làm mốc.
Các commit chỉ lưu local; chưa push và chưa merge Master. README này không tính chỉ tiêu commit chức năng.

## Kết quả thực thi

- npm ci: thành công.
- npm run build: thành công.
- npm test: 10/10 RSS tests đạt.
- Chưa có bằng chứng kiểm thử đầy đủ cho C10–C13 trên trình duyệt; đề xuất In Review cho phần đã viết, C12 tiếp tục In Progress chờ A.
