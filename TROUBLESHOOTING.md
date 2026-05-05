## Troubleshooting lỗi 403 khi Checkout

### Những điều cần kiểm tra:

1. **Đã đăng nhập chưa?**
   - Mở DevTools (F12) > Console
   - Chạy: `localStorage.getItem("token")`
   - Nếu trả về `null`, bạn chưa đăng nhập. Hãy đăng nhập lại.

2. **Backend API có chạy không?**
   - Mở DevTools > Network tab
   - Nhấn "Xác nhận thanh toán"
   - Tìm request tới `/api/orders/checkout`
   - Kiểm tra Status code (phải là 200, nếu 403 là lỗi quyền)

3. **Token có hợp lệ không?**
   - DevTools > Console
   - Chạy: `localStorage.getItem("token")`
   - Kiểm tra xem token có độ dài khác null không
   - Token phải được gửi với header: `Authorization: Bearer <token>`

4. **Customer ID có tồn tại không?**
   - Kiểm tra debug info trên checkout page
   - `customerId` không được để trống
   - Nếu `customerId = null`, hãy:
     - Đăng xuất (Logout)
     - Đăng nhập lại
     - Quay lại checkout page

5. **Lỗi 403 cụ thể là gì?**
   - DevTools > Console
   - Tìm log: `[API] Response error: 403`
   - Đọc message từ backend để xác định nguyên nhân

### Nếu vẫn lỗi:

1. Kiểm tra xem backend `/api/customers/{username}` có trả về customerId không
2. Kiểm tra xem token có hết hạn không (thử login lại)
3. Kiểm tra xem backend endpoint `/orders/checkout` có tồn tại không
4. Kiểm tra log backend để xem error chi tiết

### Debug Commands:

```javascript
// Kiểm tra thông tin hiện tại
console.log("Token:", localStorage.getItem("token"));
console.log("User:", JSON.parse(localStorage.getItem("user") || "{}"));

// Xóa cart nếu cần
localStorage.removeItem("cart");
localStorage.removeItem("checkoutCustomerInfo");
```
