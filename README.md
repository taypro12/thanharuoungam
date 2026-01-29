
# 🍷 Website Rượu Ngâm Thanh Hà - Hướng dẫn triển khai GitHub Pages

Chào bạn! Đây là website thương mại điện tử cao cấp dành cho thương hiệu **Thanh Hà**. Để đưa website này lên mạng miễn phí bằng GitHub, hãy làm theo các bước sau:

## 🚀 4 Bước để đưa Website lên mạng

### Bước 1: Tạo Repository trên GitHub
1. Truy cập [GitHub.com](https://github.com) và đăng nhập.
2. Nhấn nút **New** để tạo một Repository mới.
3. Đặt tên (ví dụ: `ruou-thanh-ha`) và chọn **Public**.
4. Nhấn **Create repository**.

### Bước 2: Tải code lên
1. Tại trang Repository mới tạo, chọn **"uploading an existing file"**.
2. Kéo toàn bộ các tệp từ máy tính của bạn vào cửa sổ trình duyệt (bao gồm `index.html`, `App.tsx`, `pages/`, `components/`, v.v.).
3. Nhấn **Commit changes**.

### Bước 3: Cấu hình GitHub Pages
1. Vào tab **Settings** (Cài đặt) của Repository.
2. Chọn mục **Pages** ở cột bên trái.
3. Tại phần **Build and deployment** > **Source**, chọn **GitHub Actions**.

### Bước 4: Chờ đợi và Tận hưởng
1. Chuyển sang tab **Actions** ở trên cùng. Bạn sẽ thấy một tiến trình đang chạy.
2. Khi tiến trình hiện dấu tích xanh ✅, hãy quay lại tab **Settings > Pages**.
3. Bạn sẽ thấy dòng chữ: **"Your site is live at..."**. Đó chính là link website của bạn!

## 🔐 Lưu ý về Bảo mật & Gemini AI
Website này sử dụng Gemini AI để tư vấn khách hàng. Khi chạy trên GitHub Pages tĩnh (static), biến `process.env.API_KEY` sẽ không tự động nhận. 
- Để AI hoạt động trên bản web chính thức, bạn nên sử dụng một công cụ build (như Vite) hoặc thay thế trực tiếp mã API Key vào code (không khuyến khích nếu là Repo công khai).
- Đối với Supabase, các khóa đã được cài đặt sẵn và sẽ hoạt động ngay lập tức.

---
*Phát triển bởi Đội ngũ Kỹ thuật Senior — Tối ưu hóa cho SEO và Trải nghiệm người dùng.*
