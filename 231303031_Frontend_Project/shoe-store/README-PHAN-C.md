# Phần C

## Quy ước

Dùng JavaScript/JSX, Functional Component, tên biến rõ nghĩa và comment tiếng Việt tại những xử lý cần giải thích. Redux đã có trong dự án được dùng chung cho sản phẩm và so sánh; không còn CompareContext.

CSS từng trang đặt riêng. Màu nhấn dùng `--color-accent` trong `src/index.css`. `.editorconfig` và `.gitattributes` thống nhất LF, UTF-8 và thụt lề 2 dấu cách.

## Kiểm tra thủ công

- Blog hiển thị 6 bài; mở chi tiết và tải lại URL.
- Slug không tồn tại hiển thị thông báo không tìm thấy.
- So sánh: thêm trùng bị từ chối; chỉ thêm tối đa 3 sản phẩm; xóa rồi thêm lại được.
- Header cập nhật số sản phẩm so sánh khi thêm/xóa. Chuyển trang vẫn giữ lựa chọn; tải lại trang xóa State theo phạm vi hiện tại.
- Thử 320, 390, 768 và 1440px: menu, Footer, lưới sản phẩm không tràn; bảng so sánh cuộn trong vùng bảng.
- Đường dẫn lạ hiển thị 404 và quay về trang chủ được.

## Tích hợp còn thiếu

A cần bàn giao AuthContext, ProtectedRoute và dữ liệu giỏ hàng để hoàn tất Account cùng số lượng giỏ hàng. B cần bàn giao tìm kiếm, wishlist và bộ lọc trước khi thêm lại các điều khiển tương ứng.

Account hiện là Component chuẩn bị nhận prop user, chưa mở route. Khi có Auth của A phải đối chiếu cấu trúc user và đặt trang bên trong ProtectedRoute.

Chưa có URL RSS chính thức nên chưa xác minh CORS với nguồn thật. Không thêm proxy công cộng tùy ý. Bản giao diện dựa vào ảnh tham chiếu đã cung cấp, chưa xác nhận thông số từng pixel trong Figma.
