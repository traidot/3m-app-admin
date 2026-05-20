#!/bin/bash

# Script để tắt và khởi động lại development server
# Chỉ tắt process của chính nó (port 3001), không tắt các process khác

echo "🔄 Đang tắt development server..."

# Tìm process đang sử dụng cổng 3001 và tắt
PORT_3001_PID=$(lsof -ti:3001 2>/dev/null || true)

if [ ! -z "$PORT_3001_PID" ]; then
    echo "🔴 Tìm thấy process trên cổng 3001 (PID: $PORT_3001_PID)"

    # Thử kill process bằng nhiều cách
    # Cách 1: kill -9
    kill -9 $PORT_3001_PID 2>/dev/null || true

    # Đợi một chút
    sleep 1

    # Kiểm tra lại xem process đã tắt chưa
    REMAINING_PID=$(lsof -ti:3001 2>/dev/null || true)
    if [ ! -z "$REMAINING_PID" ]; then
        echo "⚠️  Process vẫn còn, thử kill lại..."

        # Cách 2: Thử kill bằng TERM signal trước
        kill -TERM $REMAINING_PID 2>/dev/null || true
        sleep 1

        # Cách 3: Kill -9 lại
        kill -9 $REMAINING_PID 2>/dev/null || true
        sleep 1

        # Cách 4: Thử dùng pkill cho node processes
        pkill -9 -f "next dev.*3001" 2>/dev/null || true
        sleep 1

        # Kiểm tra lần cuối
        FINAL_PID=$(lsof -ti:3001 2>/dev/null || true)
        if [ ! -z "$FINAL_PID" ]; then
            echo "❌ Không thể tắt process trên cổng 3001 (PID: $FINAL_PID)"
            echo "💡 Bạn có thể thử tắt thủ công:"
            echo "   kill -9 $FINAL_PID"
            echo "   hoặc: lsof -ti:3001 | xargs kill -9"
            echo ""
            echo "⚠️  Tiếp tục khởi động server (có thể bị lỗi port đã được sử dụng)..."
        else
            echo "✅ Đã tắt process trên cổng 3001"
        fi
    else
        echo "✅ Đã tắt process trên cổng 3001"
    fi
else
    echo "ℹ️  Không có process nào đang chạy trên cổng 3001"
fi

# Đợi một chút để đảm bảo port đã được giải phóng
sleep 1

echo "🚀 Đang khởi động lại development server trên cổng 3001..."

# Khởi động lại development server
npm run dev
