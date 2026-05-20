# 📋 Danh sách Màn hình Hệ thống - eSIM Market

> **Kiến trúc:** 3M (Marketplace - Manager - Money)
> **Ngôn ngữ:** Tiếng Việt (Chính thức)

Tài liệu này liệt kê toàn bộ các màn hình chức năng của hệ thống, được phân loại theo vai trò người dùng.

---

## 🏢 1. Phân hệ Quản trị 3M (Admin - Chủ sàn)

_Dành cho quản trị viên điều hành toàn bộ hệ sinh thái._

### 📊 Nhóm Dashboard & Hệ thống

- `/dashboard` - **Bảng điều khiển**: Tổng quan GMV, lợi nhuận, sức khỏe API và đại lý.
- `/system/users` - **Người dùng Nội bộ**: Quản lý nhân viên vận hành sàn.
- `/system/settings` - **Cấu hình Hệ qthống**: Cài đặt tỷ giá, phí vận hành, tham số hệ thống.

### 🛒 Nhóm Chợ eSIM (Marketplace Core)

- `/marketplace/products` - **Quản lý danh mục eSIM**: Danh mục gói cước tập trung của sàn.
- `/marketplace/pricing` - **Công cụ Định giá**: Cấu hình quy tắc Markup tự động cho đại lý.

### 🏢 Nhóm Nguồn cung (Upstream Layer)

- `/upstream/suppliers` - **Nhà cung cấp Toàn cầu**: Kết nối API (Airalo, Nomad, v.v.).
- `/upstream/supplier-products` - **Mapping Sản phẩm**: Ánh xạ gói cước Supplier vào Chợ.
- `/upstream/sync-logs` - **Nhật ký Đồng bộ**: Theo dõi lịch sử gọi API đồng bộ dữ liệu.

### 👥 Nhóm Phân phối (Downstream Layer)

- `/downstream/agents` - **Đại lý & Đối tác**: Quản lý danh sách và hồ sơ đại lý.
- `/downstream/tiers` - **Nhóm Cấp bậc**: Cấu hình cấp Platinum, Gold, Silver để áp giá.
- `/downstream/api-keys` - **Cổng API (Gateway)**: Cấp phát khóa tích hợp cho đại lý.

### 💳 Nhóm Tài chính (Finance & Wallet)

- `/finance/wallets` - **Ví Đại lý**: Quản lý số dư và nạp tiền cho đại lý.
- `/finance/transactions` - **Lịch sử Giao dịch**: Nhật ký mọi biến động dòng tiền.
- `/finance/reconciliation` - **Đối soát**: Báo cáo chênh lệch tài chính Supplier/Agent.

### 📋 Nhóm Đơn hàng (Orders)

- `/orders/list` - **Tất cả đơn hàng**: Danh sách đơn hàng eSIM toàn hệ thống.
- `/orders/activation-logs` - **Nhật ký Kích hoạt**: Log kỹ thuật quá trình cấp phát eSIM.

---

## 👤 2. Phân hệ Đại lý (Agent Console)

_Dành cho đối tác mua và phân phối eSIM._

### 📈 Nhóm Cá nhân

- `/dashboard` (View Đại lý) - **Dashboard Đại lý**: Theo dõi số dư ví và doanh số.

### 🛍️ Nhóm Giao dịch

- `/marketplace/products` (View Đại lý) - **Cửa hàng eSIM**: Giao diện mua sắm cho đại lý.
- `/orders/my-orders` - **Đơn hàng của tôi**: Quản lý eSIM đã mua và lấy mã QR Code.

### 💰 Nhóm Tài chính

- `/finance/my-wallet` - **Ví của tôi**: Theo dõi số dư và nạp tiền.
- `/finance/transactions` (View Đại lý) - **Lịch sử chi tiêu**: Xem các giao dịch mua hàng.

### 🛠️ Nhóm Kỹ thuật (Dev Hub)

- `/system/api` - **API & Webhooks**: Tài liệu Swagger và quản lý khóa tích hợp (dành cho Sub-agents).

---

## 📌 Ghi chú triển khai

- **Quyền truy cập (RBAC)**: Hệ thống sử dụng Middleware để chặn truy cập chéo giữa các vai trò.
- **Giao diện**: Sử dụng Next.js App Router với cơ chế `layout` riêng cho từng phân hệ.
- **Tiêu chuẩn**: Tất cả các màn hình phải tuân thủ bộ UI/UX đã Việt hóa.
