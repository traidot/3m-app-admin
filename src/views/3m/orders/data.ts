export type OrderStatus = 'success' | 'pending' | 'failed' | 'refunded'

export type Order = {
  id: string
  customerName: string
  agentName: string
  packageName: string
  costUSD: number
  retailPriceVND: number
  supplier: string
  status: OrderStatus
  createdAt: string
  activationLog: string
}

export const ORDERS: Order[] = [
  {
    id: 'ORD-09520',
    customerName: 'Nguyễn Văn An',
    agentName: 'TravelConnect SG',
    packageName: 'eSIM Nhật Bản 5GB 7 ngày',
    costUSD: 4.2,
    retailPriceVND: 149_000,
    supplier: 'eSIM Access',
    status: 'success',
    createdAt: '2026-05-20 09:32',
    activationLog: JSON.stringify([
      { time: '09:32:01', event: 'Khởi tạo yêu cầu cấp phát eSIM từ đại lý TravelConnect SG' },
      { time: '09:32:02', event: 'Gọi API nhà cung cấp eSIM Access (ESA-JP-5G)' },
      { time: '09:32:04', event: 'Nhận phản hồi từ Supplier: Code 200 SUCCESS' },
      { time: '09:32:05', event: 'Tải QR Code thành công: LPA:1$RSP.ESIMACCESS.COM$ESA-3M-JP-QR8320' },
      { time: '09:32:06', event: 'Kích hoạt thành công eSIM và gửi QR Code tới khách hàng' }
    ], null, 2)
  },
  {
    id: 'ORD-09521',
    customerName: 'Trần Thị Bích',
    agentName: 'Global Roam JP',
    packageName: 'eSIM Hàn Quốc 10GB 15 ngày',
    costUSD: 7.2,
    retailPriceVND: 245_000,
    supplier: 'GoMoWorld',
    status: 'success',
    createdAt: '2026-05-20 10:15',
    activationLog: JSON.stringify([
      { time: '10:15:10', event: 'Khởi tạo yêu cầu cấp phát eSIM' },
      { time: '10:15:11', event: 'Gọi API nhà cung cấp GoMoWorld (GMW-KR-10GB)' },
      { time: '10:15:13', event: 'Phản hồi Supplier: SUCCESS' },
      { time: '10:15:14', event: 'Đã lưu cấu hình eSIM QR Code' }
    ], null, 2)
  },
  {
    id: 'ORD-09522',
    customerName: 'Công ty TNHH Du lịch Sao Việt',
    agentName: 'EuroSim Partners',
    packageName: 'eSIM Châu Âu 30 nước 5GB 30 ngày',
    costUSD: 12.4,
    retailPriceVND: 399_000,
    supplier: 'eSIM Access',
    status: 'success',
    createdAt: '2026-05-20 11:02',
    activationLog: JSON.stringify([
      { time: '11:02:00', event: 'Khởi tạo yêu cầu cấp phát eSIM' },
      { time: '11:02:01', event: 'Sử dụng nguồn đã Pinned: eSIM Access' },
      { time: '11:02:03', event: 'Supplier phản hồi: SUCCESS' }
    ], null, 2)
  },
  {
    id: 'ORD-09523',
    customerName: 'Phạm Quỳnh Như',
    agentName: 'EuroSim Partners',
    packageName: 'eSIM Đông Nam Á 8 nước 3GB 7 ngày',
    costUSD: 3.5,
    retailPriceVND: 119_000,
    supplier: 'GoMoWorld',
    status: 'success',
    createdAt: '2026-05-18 14:05',
    activationLog: JSON.stringify([
      { time: '14:05:00', event: 'Yêu cầu cấp phát eSIM Đông Nam Á' },
      { time: '14:05:02', event: 'GoMoWorld phản hồi: SUCCESS' }
    ], null, 2)
  },
  {
    id: 'ORD-09524',
    customerName: 'Lê Minh Chiến',
    agentName: 'TravelConnect SG',
    packageName: 'SIM vật lý đi Mỹ 20GB 30 ngày',
    costUSD: 18.5,
    retailPriceVND: 599_000,
    supplier: 'eSIM Access',
    status: 'pending',
    createdAt: '2026-05-20 16:45',
    activationLog: JSON.stringify([
      { time: '16:45:10', event: 'Khởi tạo yêu cầu mua SIM vật lý' },
      { time: '16:45:12', event: 'Chờ bộ phận vận kho xác nhận đóng gói và chuyển phát nhanh' }
    ], null, 2)
  },
  {
    id: 'ORD-09525',
    customerName: 'Hoàng Văn Đạt',
    agentName: 'IndoConnect',
    packageName: 'eSIM Đông Nam Á 8 nước 3GB 7 ngày',
    costUSD: 3.5,
    retailPriceVND: 119_000,
    supplier: 'GoMoWorld',
    status: 'failed', // Failed order
    createdAt: '2026-05-20 17:30',
    activationLog: JSON.stringify([
      { time: '17:30:01', event: 'Khởi tạo yêu cầu cấp phát eSIM' },
      { time: '17:30:02', event: 'Gọi API nhà cung cấp GoMoWorld (GMW-SEA-3GB)' },
      { time: '17:30:12', event: 'Lỗi: Connection timeout (Không có phản hồi từ nhà cung cấp sau 10 giây)' },
      { time: '17:30:13', event: 'Cấp phát thất bại - Trạng thái FAILED' }
    ], null, 2)
  },
  {
    id: 'ORD-09526',
    customerName: 'Đỗ Tuấn Kiệt',
    agentName: 'VietSim Go',
    packageName: 'eSIM Toàn cầu 100 nước 10GB 30 ngày',
    costUSD: 35.0,
    retailPriceVND: 999_000,
    supplier: 'Airalo Wholesale',
    status: 'failed', // Another failed order
    createdAt: '2026-05-19 08:12',
    activationLog: JSON.stringify([
      { time: '08:12:01', event: 'Khởi tạo yêu cầu cấp phát eSIM' },
      { time: '08:12:02', event: 'Gọi API Airalo Wholesale' },
      { time: '08:12:03', event: 'Lỗi API: Insufficient Balance in Upstream Wallet (Hết số dư ví phía Nhà cung cấp)' },
      { time: '08:12:04', event: 'Cấp phát thất bại - Trạng thái FAILED' }
    ], null, 2)
  }
]

export const statusColor: Record<OrderStatus, 'success' | 'warning' | 'error' | 'secondary'> = {
  success: 'success',
  pending: 'warning',
  failed: 'error',
  refunded: 'secondary'
}

export const statusLabel: Record<OrderStatus, string> = {
  success: 'Thành công',
  pending: 'Chờ duyệt',
  failed: 'Thất bại',
  refunded: 'Đã hoàn tiền'
}

export const USD_VND = 25500
export const formatVND = (vnd: number) => `${vnd.toLocaleString('vi-VN')}đ`
export const formatUSD = (usd: number) => `$${usd.toFixed(2)}`
export const formatUSDinVND = (usd: number) => `${Math.round(usd * USD_VND).toLocaleString('vi-VN')}đ`
