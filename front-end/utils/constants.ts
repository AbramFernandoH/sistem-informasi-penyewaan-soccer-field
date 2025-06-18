export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
}

export const COOKIES = {
  ADMIN_ACCESS_TOKEN: 'admin-goedang-futsal-access-token',
  ADMIN_REFRESH_TOKEN: 'admin-goedang-futsal-refresh-token',
  USER_ACCESS_TOKEN: 'user-goedang-futsal-access-token',
  USER_REFRESH_TOKEN: 'user-goedang-futsal-refresh-token',
}

export const timeSlots = [
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
]

export const SCHEDULE_COLORS = [
  { card: '#FEF3C7', text: '#78350F', hover: '#FDE68A' }, // amber
  { card: '#D1FAE5', text: '#065F46', hover: '#A7F3D0' }, // emerald
  { card: '#F1F5F9', text: '#111827', hover: '#E5E7EB' }, // gray
  { card: '#DBEAFE', text: '#1E3A8A', hover: '#BFDBFE' }, // blue
  { card: '#FFF7ED', text: '#7C2D12', hover: '#FED7AA' }, // orange
  { card: '#E0E7FF', text: '#3730A3', hover: '#C7D2FE' }, // indigo
  { card: '#FFE4E6', text: '#831843', hover: '#FECDD3' }, // pink
  { card: '#EDE9FE', text: '#5B21B6', hover: '#DDD6FE' }, // violet
  { card: '#FEF9C3', text: '#854D0E', hover: '#FDE68A' }, // yellow
  { card: '#F3E8FF', text: '#6B21A8', hover: '#E9D5FF' }, // purple
  { card: '#DCFCE7', text: '#166534', hover: '#BBF7D0' }, // green
  { card: '#F0F9FF', text: '#075985', hover: '#BAE6FD' }, // sky
  { card: '#E2E8F0', text: '#1E293B', hover: '#CBD5E1' }, // slate
  { card: '#ECFCCB', text: '#365314', hover: '#D9F99D' }, // lime
  { card: '#FEE2E2', text: '#991B1B', hover: '#FECACA' }, // rose
]
