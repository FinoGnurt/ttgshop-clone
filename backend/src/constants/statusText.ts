/**
 * File: status-text.ts
 * Mô tả: Định nghĩa các mô tả (text) tương ứng cho từng mã trạng thái HTTP.
 * Giúp hiển thị thông điệp thân thiện cho người dùng hoặc log dễ đọc hơn.
 */

import { STATUS_CODE } from './statusCode.ts'

/**
 * Đối tượng ánh xạ giữa HTTP status code và nội dung mô tả.
 * Cấu trúc: { [STATUS_CODE.<CODE>]: '<Thông điệp>' }
 */
export const STATUS_TEXT: Record<number, string> = {
  // ───────────────────────────────
  // 1xx — Informational responses
  // ───────────────────────────────
  [STATUS_CODE.CONTINUE]: 'CONTINUE', // Tiếp tục gửi request
  [STATUS_CODE.SWITCHING_PROTOCOLS]: 'SWITCHING_PROTOCOLS', // Đang chuyển giao thức
  [STATUS_CODE.PROCESSING]: 'PROCESSING', // Đang xử lý (WebDAV)

  // ───────────────────────────────
  // 2xx — Successful responses
  // ───────────────────────────────
  [STATUS_CODE.OK]: 'OK', // Request thành công
  [STATUS_CODE.CREATED]: 'CREATED', // Đã tạo tài nguyên mới
  [STATUS_CODE.ACCEPTED]: 'ACCEPTED', // Request được chấp nhận nhưng chưa xử lý
  [STATUS_CODE.NO_CONTENT]: 'NO_CONTENT', // Thành công nhưng không có dữ liệu trả về
  [STATUS_CODE.PARTIAL_CONTENT]: 'PARTIAL_CONTENT', // Trả về một phần nội dung

  // ───────────────────────────────
  // 3xx — Redirection messages
  // ───────────────────────────────
  [STATUS_CODE.MULTIPLE_CHOICES]: 'MULTIPLE_CHOICES', // Có nhiều lựa chọn cho tài nguyên
  [STATUS_CODE.MOVED_PERMANENTLY]: 'MOVED_PERMANENTLY', // Đường dẫn mới vĩnh viễn
  [STATUS_CODE.FOUND]: 'FOUND', // Đường dẫn tạm thời
  [STATUS_CODE.SEE_OTHER]: 'SEE_OTHER', // Xem tài nguyên tại URL khác
  [STATUS_CODE.NOT_MODIFIED]: 'NOT_MODIFIED', // Dữ liệu chưa thay đổi (cache)
  [STATUS_CODE.TEMPORARY_REDIRECT]: 'TEMPORARY_REDIRECT', // Redirect tạm thời
  [STATUS_CODE.PERMANENT_REDIRECT]: 'PERMANENT_REDIRECT', // Redirect vĩnh viễn

  // ───────────────────────────────
  // 4xx — Client error responses
  // ───────────────────────────────
  [STATUS_CODE.BAD_REQUEST]: 'BAD_REQUEST', // Request sai cú pháp hoặc dữ liệu
  [STATUS_CODE.UNAUTHORIZED]: 'UNAUTHORIZED', // Chưa đăng nhập hoặc token không hợp lệ
  [STATUS_CODE.FORBIDDEN]: 'FORBIDDEN', // Không có quyền thực hiện
  [STATUS_CODE.NOT_FOUND]: 'NOT_FOUND', // Không tìm thấy tài nguyên
  [STATUS_CODE.METHOD_NOT_ALLOWED]: 'METHOD_NOT_ALLOWED', // Sai phương thức (GET/POST/PUT/DELETE)
  [STATUS_CODE.NOT_ACCEPTABLE]: 'NOT_ACCEPTABLE', // Dữ liệu không được chấp nhận
  [STATUS_CODE.CONFLICT]: 'CONFLICT', // Dữ liệu xung đột (vd: email đã tồn tại)
  [STATUS_CODE.GONE]: 'GONE', // Tài nguyên không còn tồn tại
  [STATUS_CODE.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY', // Dữ liệu không hợp lệ (AJV/Validator)
  [STATUS_CODE.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS', // Giới hạn tần suất request (rate limit)

  // ───────────────────────────────
  // 5xx — Server error responses
  // ───────────────────────────────
  [STATUS_CODE.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR', // Lỗi nội bộ server
  [STATUS_CODE.NOT_IMPLEMENTED]: 'NOT_IMPLEMENTED', // Chức năng chưa sẵn sàng
  [STATUS_CODE.BAD_GATEWAY]: 'BAD_GATEWAY', // Lỗi khi server là proxy/gateway
  [STATUS_CODE.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE', // Server quá tải hoặc bảo trì
  [STATUS_CODE.GATEWAY_TIMEOUT]: 'GATEWAY_TIMEOUT' // Gateway không nhận phản hồi kịp
}
