/**
 * Hook for candidate status labels and colors
 * Mock implementation for UI demo
 */

export const useCandidateStatus = (locale: 'vi' | 'en' | 'ja' = 'vi') => {
  // Mock status labels and colors
  const labels: Record<string, string> = {
    'pending': locale === 'vi' ? 'Chờ xử lý' : locale === 'en' ? 'Pending' : '保留中',
    'approved': locale === 'vi' ? 'Đã duyệt' : locale === 'en' ? 'Approved' : '承認済み',
    'rejected': locale === 'vi' ? 'Từ chối' : locale === 'en' ? 'Rejected' : '拒否',
    'draft': locale === 'vi' ? 'Nháp' : locale === 'en' ? 'Draft' : '下書き',
  }

  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'error',
    'draft': 'default',
  }

  return {
    labels,
    colors,
  }
}
