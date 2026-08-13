import { apiRequest, apiEnabled } from './api';

export { apiEnabled };

const EMPTY = { items: [], total: 0 };

export async function fetchAdminSummary() {
  if (!apiEnabled) return null;
  return apiRequest('/api/admin/summary', { auth: true });
}

export async function fetchAdminBookings(statusFilter) {
  if (!apiEnabled) return EMPTY;
  return apiRequest('/api/admin/bookings', { auth: true, query: statusFilter ? { status: statusFilter } : {} });
}

export async function fetchAdminRequests(statusFilter) {
  if (!apiEnabled) return EMPTY;
  return apiRequest('/api/admin/booking-requests', { auth: true, query: statusFilter ? { status: statusFilter } : {} });
}

export function updateBookingStatus(id, newStatus) {
  return apiRequest(`/api/admin/bookings/${id}`, {
    method: 'PATCH', auth: true, body: JSON.stringify({ status: newStatus }),
  });
}

export function updateRequestStatus(id, newStatus) {
  return apiRequest(`/api/admin/booking-requests/${id}`, {
    method: 'PATCH', auth: true, body: JSON.stringify({ status: newStatus }),
  });
}

export const BOOKING_STATUSES = ['payment_pending', 'paid', 'confirmed', 'completed', 'cancelled', 'refunded'];
export const REQUEST_STATUSES = ['inquiry_pending', 'contacted', 'confirmed', 'cancelled'];

export const STATUS_LABELS = {
  payment_pending: 'Pago pendiente',
  paid: 'Pagada',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  refunded: 'Reembolsada',
  inquiry_pending: 'Solicitud pendiente',
  contacted: 'Contactado',
};
