# Kế hoạch phát triển Portfolio Web App (Nuxt 4 + Firebase)

Bản kế hoạch chi tiết xây dựng hệ thống Portfolio cá nhân tích hợp trang quản trị (Admin Dashboard) sử dụng Nuxt 4 và Firebase (Auth, Firestore, Storage).

---

## 🔑 Tính năng 1: Xác thực & Phân quyền (Authentication)
Bảo vệ trang quản trị để chỉ duy nhất bạn có quyền truy cập và thay đổi dữ liệu.

* **Backend (Firebase Auth):**
  * Kích hoạt Firebase Authentication (đăng nhập bằng Email/Password hoặc Google).
* **Frontend (Nuxt 4):**
  * Sử dụng thư viện chính thức `@vuefire/nuxt` và `vuefire` để quản lý trạng thái xác thực và đồng bộ dữ liệu.
  * Xây dựng trang đăng nhập `/login` đơn giản tại `app/pages/login.vue`.
  * Tạo Nuxt Route Middleware `app/middleware/auth.ts` để bảo vệ toàn bộ thư mục `app/pages/admin/`. Nếu người dùng chưa đăng nhập, tự động chuyển hướng về `/login` (sử dụng helper `getCurrentUser()` của VueFire để đảm bảo trạng thái đăng nhập được tải đầy đủ).

---

## 📄 Tính năng 2: Quản lý & Hiển thị CV (CV Management)
Tự động hóa luồng cập nhật CV mà không cần can thiệp trực tiếp vào mã nguồn.

* **Admin Dashboard (`app/pages/admin/`):**
  * Xây dựng UI form upload dạng kéo-thả (Drag & Drop) chấp nhận định dạng PDF.
  * Tích hợp Firebase Storage để đẩy file lên đám mây. Đặt tên file cố định (ví dụ: `cv/portfolio_cv.pdf`) để tự động ghi đè bản cũ, hoặc quản lý theo phiên bản.
  * Lấy URL tải xuống (`getDownloadURL`) và ghi đè vào một document cấu hình chung trong Firestore (ví dụ: collection `settings`, document `general`).
* **Public Portfolio (`app/pages/index.vue`):**
  * Component Hero Section (`app/components/Hero.vue`) sử dụng `useAsyncData` kết hợp VueFire để fetch URL của CV từ Firestore.
  * Gắn URL này vào nút "Download CV", cấu hình cache control phù hợp để đảm bảo nhà tuyển dụng luôn tải được phiên bản mới nhất.

---

## 💼 Tính năng 3: Quản lý Kinh nghiệm (Experience CRUD)
Hiển thị lộ trình công việc từ trước đến nay một cách linh hoạt và trực quan.

* **Backend (Firestore):**
  * Tạo collection `experiences`.
  * Schema dữ liệu chuẩn:
    * `company`: string (Tên công ty, ví dụ: FPT Software)
    * `role`: string (Vị trí công việc, ví dụ: Software Engineer)
    * `startDate`: string (Định dạng `YYYY-MM` để dễ sắp xếp)
    * `endDate`: string (Định dạng `YYYY-MM` hoặc `"Present"` nếu đang làm việc)
    * `description`: string (Mô tả công việc dưới dạng Markdown hoặc danh sách)
    * `order`: number (Thứ tự sắp xếp tùy chọn)
* **Admin Dashboard:**
  * Xây dựng bảng (Table) liệt kê các mốc công việc.
  * Xây dựng form Thêm / Sửa / Xóa (Create, Read, Update, Delete) để quản lý dữ liệu trực tiếp.
* **Public Portfolio:**
  * Xây dựng component Timeline (`app/components/Timeline.vue`).
  * Fetch danh sách `experiences` từ Firestore, sắp xếp theo thời gian giảm dần (`startDate` từ mới nhất đến cũ nhất) và render ra giao diện.

---

## 🚀 Tính năng 4: Quản lý Dự án nổi bật (Projects CRUD)
Làm nổi bật các giải pháp xử lý hệ thống, AI, hoặc Frontend/Full-stack.

* **Backend (Firestore & Storage):**
  * Tạo collection `projects` chứa: `title`, `techStack` (mảng string), `description`, `demoLink`, `githubLink`, `imagePath` (đường dẫn trong Storage để xóa file), `imageUrl` (URL hiển thị).
* **Admin Dashboard:**
  * Form nhập liệu chi tiết cho dự án.
  * Tích hợp upload ảnh minh họa (Thumbnail) lên Firebase Storage, sau đó lưu thông tin URL vào Firestore. Khi cập nhật hoặc xóa dự án, tự động xóa tệp ảnh cũ trên Storage để tránh rác hệ thống.
* **Public Portfolio:**
  * Xây dựng dạng Lưới (Grid) các thẻ Card dự án.
  * Sử dụng module `@nuxt/image` cấu hình provider phù hợp để tối ưu hóa hình ảnh (lazy load, resize).

---

## 🏷️ Tính năng 5: Quản lý Kỹ năng (Skills Management)
Hệ thống hóa các công nghệ nền tảng và công cụ chuyên sâu.

* **Backend (Firestore):**
  * Tạo collection `skills`.
  * Schema dữ liệu: `name` (string), `category` (string: `'frontend' | 'backend' | 'tools' | 'ai-automation'`), `order` (number).
* **Admin Dashboard:**
  * Form thêm/bớt/sửa các tag kỹ năng và phân loại nhóm.
* **Public Portfolio:**
  * Render các kỹ năng thành dạng Badge (nhãn) trực quan, có phân chia theo từng danh mục rõ ràng (Frontend, Backend, Tools, AI Agent & Automation) giúp hệ thống quét hồ sơ (ATS) dễ dàng đọc và đánh giá.

---

## 🛡️ Tính năng 6: Bảo mật, Tối ưu SEO & Triển khai (Security, SEO & Deployment)
Đảm bảo trang web tải nhanh, bảo mật và thân thiện với các công cụ tìm kiếm.

* **Bảo mật (Firebase Security Rules):**
  * Cấu hình Security Rules trên Firebase Console:
    * **Firestore**: Khách vãng lai chỉ được đọc (`allow read: if true;`), chỉ admin đăng nhập mới được viết (`allow write: if request.auth != null;`).
    * **Storage**: Tương tự, chỉ cho phép admin ghi đè hoặc upload file.
* **Cấu hình Môi trường (`.env`):**
  * Lưu trữ cấu hình Firebase SDK trong file `.env` cục bộ.
  * Khai báo trong `runtimeConfig.public` của `nuxt.config.ts` để sử dụng an toàn trên cả Client và Server.
* **SEO & Hiệu năng:**
  * Cấu hình `useSeoMeta` động cho thẻ `title`, `description` tại từng trang.
  * Triển khai chế độ **Static Site Generation (SSG)**: Giữ `ssr: true` trong `nuxt.config.ts` kết hợp lệnh `npx nuxt generate` để build ra trang tĩnh hoàn toàn, giúp công cụ tìm kiếm dễ dàng crawl nội dung và tối ưu tốc độ tải trang (tải tức thì).
* **Giao diện & Styling:**
  * Sử dụng **Vanilla CSS** hoặc **Tailwind CSS** kết hợp với các hiệu ứng chuyển động mượt mà (glassmorphism, micro-animations, light/dark mode) để mang lại trải nghiệm người dùng (UX) cao cấp nhất.
