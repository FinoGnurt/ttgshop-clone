/**
 * 📘 statusCode.ts
 *
 * File này chứa toàn bộ mã trạng thái HTTP (HTTP Status Codes)
 * dùng trong toàn dự án backend. Mục tiêu là:
 *  - Tránh hard-code (viết số trực tiếp như 200, 404...)
 *  - Dễ đọc và dễ bảo trì
 *  - Đồng nhất khi trả response về frontend
 *
 * Tham khảo: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */

export const STATUS_CODE = {
  // --- 1xx Informational ---
  /** Yêu cầu tiếp tục */
  CONTINUE: 100,

  /** Server đang chuyển đổi giao thức */
  SWITCHING_PROTOCOLS: 101,

  /** WebDAV – Server đang xử lý yêu cầu */
  PROCESSING: 102,

  // ✅ 2xx – Success: Yêu cầu đã được xử lý thành công
  /** Yêu cầu thành công (GET) */
  OK: 200,

  /** Tạo mới thành công (POST) */
  CREATED: 201,

  /** Đã nhận yêu cầu, xử lý sau (thường dùng cho async) */
  ACCEPTED: 202,

  /** Thành công nhưng không có nội dung trả về (DELETE) */
  NO_CONTENT: 204,

  /** Trả về một phần nội dung (range request) */
  PARTIAL_CONTENT: 206,

  // ⚠️ 3xx – Redirection: Chuyển hướng
  /** Nhiều lựa chọn có thể đáp ứng yêu cầu */
  MULTIPLE_CHOICES: 300,

  /** Đường dẫn mới (redirect vĩnh viễn) */
  MOVED_PERMANENTLY: 301,

  /** Tạm thời chuyển hướng */
  FOUND: 302,

  /** Chuyển hướng đến một URL khác bằng GET */
  SEE_OTHER: 303,

  /** Tài nguyên chưa thay đổi (dùng với cache) */
  NOT_MODIFIED: 304,

  /** Chuyển hướng tạm thời, giữ nguyên phương thức HTTP */
  TEMPORARY_REDIRECT: 307,

  /** Chuyển hướng vĩnh viễn, giữ nguyên phương thức HTTP */
  PERMANENT_REDIRECT: 308,

  // ❌ 4xx – Client Error: Lỗi phía client (người dùng)
  /** Dữ liệu gửi lên không hợp lệ (Validation error) */
  BAD_REQUEST: 400,

  /** Chưa đăng nhập hoặc token không hợp lệ */
  UNAUTHORIZED: 401,

  /** Không có quyền truy cập (role, permission) */
  FORBIDDEN: 403,

  /** Không tìm thấy tài nguyên (endpoint, ID) */
  NOT_FOUND: 404,

  /** Phương thức HTTP không được phép */
  METHOD_NOT_ALLOWED: 405,

  /** Định dạng yêu cầu không được chấp nhận */
  NOT_ACCEPTABLE: 406,

  /** Xung đột dữ liệu (VD: email đã tồn tại) */
  CONFLICT: 409,

  /** Tài nguyên đã bị xóa vĩnh viễn */
  GONE: 410,

  /** Dữ liệu hợp lệ cú pháp nhưng sai logic (VD: password confirm mismatch) */
  UNPROCESSABLE_ENTITY: 422,

  /** Gửi request quá nhanh (rate limit) */
  TOO_MANY_REQUESTS: 429,

  // 🔥 5xx – Server Error: Lỗi phía backend
  /** Lỗi không xác định từ server */
  INTERNAL_SERVER_ERROR: 500,

  /** API chưa được triển khai */
  NOT_IMPLEMENTED: 501,

  /** Lỗi gateway hoặc proxy */
  BAD_GATEWAY: 502,

  /** Server đang bảo trì hoặc quá tải */
  SERVICE_UNAVAILABLE: 503,

  /** Server không phản hồi kịp thời */
  GATEWAY_TIMEOUT: 504
} as const

export type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE]
