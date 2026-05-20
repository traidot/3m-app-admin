// Returns first character from string
export const getInitials = (string: string) => {
  if (!string || string.trim().length === 0) return ''
  return string.trim().charAt(0).toUpperCase()
}
