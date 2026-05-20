# eSIM Market: Hệ thống màn hình Đa vai trò (Admin & Agent)

> **Feature Name:** Dual-Role Dashboard & Marketplace Management
> **Architecture:** 3M (Marketplace - Manager - Money)
> **Date:** 2026-04-24

## 1. Tổng quan hệ thống
Hệ thống được thiết kế để giải quyết bài toán sàn giao dịch eSIM 3 lớp. 3M Admin đóng vai trò trung tâm điều phối, trong khi Agent đóng vai trò tiêu thụ và phân phối lại cho người dùng cuối qua Web hoặc API.

## 2. Phân hệ 3M Admin (Quản trị sàn)

### 2.1. Command Center (Dashboard)
- **Mục tiêu**: Theo dõi sức khỏe hệ thống.
- **Widgets**:
    - Doanh thu sàn (GMV) & Lợi nhuận (Profit).
    - Trạng thái kết nối API với các Supplier (Nomad, Airalo, v.v.).
    - Top 5 đại lý có doanh số cao nhất.
    - Cảnh báo tồn kho thấp (Low Inventory).

### 2.2. Upstream Hub
- **Supplier Management**: Quản lý thông tin kết nối, API Key, Webhook của nhà cung cấp gốc.
- **Supplier Products**: Danh sách sản phẩm "thô" từ nhà cung cấp, hỗ trợ ánh xạ (mapping) sang sản phẩm của sàn.
- **Sync Logs**: Nhật ký đồng bộ giá và tồn kho tự động.

### 2.3. Marketplace Matrix
- **Inventory Manager**: Quản lý số lượng mã eSIM có sẵn hoặc hạn mức API còn lại.
- **Pricing Engine**: 
    - Cấu hình Markup mặc định cho toàn sàn.
    - Cấu hình giá riêng (Custom Price) cho từng nhóm đại lý (Platinum/Gold).

### 2.4. Downstream Control
- **Agent Directory**: Quản lý hồ sơ đại lý, thông tin pháp lý, cấp bậc.
- **API Gateway Settings**: Quản lý API Key, White-list IP và Webhook URL của đại lý.

### 2.5. Master Finance
- **Wallet Logs**: Lịch sử biến động số dư của tất cả đại lý.
- **Reconciliation Reports**: Đối soát chênh lệch giữa giá vốn (Supplier) và giá bán (Agent).

---

## 3. Phân hệ Agent Console (Đại lý)

### 3.1. Sales Dashboard
- **Widgets**:
    - Số dư ví khả dụng (Available Balance).
    - Số lượng eSIM đã bán trong tháng.
    - Biểu đồ biến động doanh số.

### 3.2. eSIM Store (Shopping)
- **Giao diện**: Grid/List view các gói cước.
- **Tính năng**: 
    - Lọc theo Quốc gia/Vùng lãnh thổ.
    - So sánh giá các gói.
    - Nút "Mua ngay" (Deduce balance & get eSIM).

### 3.3. My Assets (Orders)
- **Tính năng**:
    - Danh sách các mã eSIM đã mua.
    - Hiển thị mã QR Code để khách quét.
    - Hướng dẫn kích hoạt (Installation Guide) tương ứng với từng nhà cung cấp.

### 3.4. Wallet Hub
- **Tính năng**:
    - Nạp tiền (Top-up via Bank Transfer/Gateway).
    - Nhật ký giao dịch chi tiết.
    - Xuất hóa đơn (Invoice) cho mỗi đơn hàng.

### 3.5. Dev Studio (API Hub)
- **Tính năng**:
    - Swagger UI / Tài liệu tích hợp API.
    - Quản lý API Key cá nhân.
    - Test Webhook endpoint.

---

## 4. Đặc tả kỹ thuật & Ràng buộc
- **Authentication**: Sử dụng NextAuth với vai trò `ADMIN` hoặc `AGENT`.
- **State Management**: Sử dụng React Context hoặc Redux để quản lý thông tin ví và giỏ hàng.
- **Real-time**: Sử dụng Webhook để cập nhật trạng thái đơn hàng khi eSIM được kích hoạt từ Supplier.
- **Database Rules**: 
    - Agent không được phép truy cập trực tiếp vào bảng `SupplierProduct`.
    - Mọi giao dịch mua hàng phải được thực hiện qua `DigitalOrderService` để đảm bảo tính toàn vẹn (Atomicity).

---
**BA Review Checklist:**
- [x] Đã bao gồm đủ 3 lớp Upstream, 3M Core, Downstream.
- [x] Có đầy đủ chức năng quản lý Tài chính & Ví.
- [x] Đã thiết kế riêng biệt cho 2 vai trò.
- [x] Đã tích hợp nhu cầu kết nối API (Dev Hub).
