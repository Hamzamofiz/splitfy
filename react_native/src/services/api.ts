import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';

declare global {
  var __SPLITIFY_API_URL__: string | undefined;
  var __SPLITIFY_API_HOST__: string | undefined;
}

const API_HOST_OVERRIDE = '';

export type UserRole = 'admin' | 'roommate';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  roomId?: string | null;
};

export type Room = {
  _id: string;
  roomName: string;
  monthlyRent: number;
  raastId?: string;
  easypaisaNumber?: string;
  inviteCode?: string;
  admin: User | string;
  members: Array<User | string>;
};

export type BillAssignment = {
  user: User | string;
  shareAmount: number;
  isPaid: boolean;
  paidAt?: string | null;
};

export type Bill = {
  _id: string;
  title: string;
  totalAmount: number;
  dueDate: string;
  billType: string;
  status: string;
  assignedTo: BillAssignment[];
};

export type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  approvalStatus: string;
  date: string;
  paidBy: User | string;
};

export type MaintenanceIssue = {
  _id: string;
  issueType: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  repairCost: number;
  reportedBy: User | string;
};

export type Settlement = {
  _id: string;
  payer: User | string;
  payee: User | string;
  amount: number;
  paymentMethod: string;
  status: 'Pending' | 'Completed';
  note?: string;
  createdAt: string;
};

export type Attendance = {
  _id: string;
  month: string;
  absentDays: number[];
};

type AuthResponse = User & { success: boolean; token: string };

function sessionFromResponse(response: AuthResponse) {
  const { _id, name, email, role, phone, roomId, token } = response;
  return { user: { _id, name, email, role, phone, roomId }, token };
}

function getBaseUrl() {
  if (globalThis.__SPLITIFY_API_URL__) {
    return globalThis.__SPLITIFY_API_URL__.replace(/\/+$/, '');
  }

  const host = globalThis.__SPLITIFY_API_HOST__
    || API_HOST_OVERRIDE
    || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
  return `http://${host}:3000/api`;
}

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === 'string') return responseMessage;
    if (error.code === AxiosError.ERR_NETWORK) {
      return 'Unable to reach the API. Check the server address and that your device is on the same network.';
    }
    if (error.code === AxiosError.ECONNABORTED) return 'The request timed out. Please try again.';
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export const authApi = {
  async login(email: string, password: string) {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return sessionFromResponse(response.data);
  },
  async signup(payload: { name: string; email: string; password: string; role: UserRole; phone?: string; inviteCode?: string }) {
    const response = await apiClient.post<AuthResponse>('/auth/signup', payload);
    return sessionFromResponse(response.data);
  },
  async updateProfile(payload: { name: string; phone?: string }) {
    const response = await apiClient.put<AuthResponse>('/auth/profile', payload);
    return sessionFromResponse(response.data).user;
  },
};

export const roomApi = {
  async getMyRoom() {
    try {
      const response = await apiClient.get<{ success: boolean; room: Room }>('/room');
      return response.data.room;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  },
  async create(payload: { roomName: string; monthlyRent: number; raastId?: string; easypaisaNumber?: string }) {
    const response = await apiClient.post<{ success: boolean; data: Room }>('/room/create', payload);
    return response.data.data;
  },
  async update(roomId: string, payload: { roomName: string; monthlyRent: number; raastId: string; easypaisaNumber: string }) {
    const response = await apiClient.patch<{ success: boolean; room: Room }>(`/room/${roomId}`, payload);
    return response.data.room;
  },
};

export const billApi = {
  async list(roomId: string) {
    const response = await apiClient.get<{ bills: Bill[] }>(`/bills/room/${roomId}`);
    return response.data.bills;
  },
  async create(payload: {
    title: string;
    totalAmount: number;
    dueDate: string;
    billType: string;
    roomId: string;
    assignedTo: BillAssignment[];
  }) {
    const response = await apiClient.post<{ bill: Bill }>('/bills', payload);
    return response.data.bill;
  },
  async markPaid(billId: string) {
    const response = await apiClient.patch<{ bill: Bill }>(`/bills/${billId}/pay`);
    return response.data.bill;
  },
};

export const expenseApi = {
  async list(roomId: string) {
    const response = await apiClient.get<{ expenses: Expense[] }>(`/expenses/room/${roomId}`);
    return response.data.expenses;
  },
  async create(payload: {
    title: string;
    amount: number;
    roomId: string;
    splitBetween: string[];
    category: string;
    approvalStatus: 'PENDING';
  }) {
    const response = await apiClient.post<{ expense: Expense }>('/expenses', payload);
    return response.data.expense;
  },
};

export const maintenanceApi = {
  async list(roomId: string) {
    const response = await apiClient.get<{ maintenanceIssues: MaintenanceIssue[] }>(`/maintenance/room/${roomId}`);
    return response.data.maintenanceIssues;
  },
  async create(payload: { roomId: string; issueType: string; description: string; repairCost?: number }) {
    const response = await apiClient.post<{ maintenance: MaintenanceIssue }>('/maintenance', payload);
    return response.data.maintenance;
  },
  async update(id: string, payload: Partial<Pick<MaintenanceIssue, 'status' | 'repairCost'>>) {
    const response = await apiClient.patch<{ maintenance: MaintenanceIssue }>(`/maintenance/${id}`, payload);
    return response.data.maintenance;
  },
};

export const settlementApi = {
  async list(roomId: string) {
    const response = await apiClient.get<{ settlements: Settlement[] }>(`/settlements/room/${roomId}`);
    return response.data.settlements;
  },
  async create(payload: { roomId: string; payee: string; amount: number; paymentMethod: string; note: string; status: Settlement['status'] }) {
    const response = await apiClient.post<{ settlement: Settlement }>('/settlements', payload);
    return response.data.settlement;
  },
  async update(id: string, payload: { status: Settlement['status'] }) {
    const response = await apiClient.patch<{ settlement: Settlement }>(`/settlements/${id}`, payload);
    return response.data.settlement;
  },
};

export const attendanceApi = {
  async get(roomId: string, month: string) {
    const response = await apiClient.get<{ attendance: Attendance | null }>('/attendance', { params: { roomId, month } });
    return response.data.attendance;
  },
  async save(roomId: string, month: string, absentDays: number[]) {
    const response = await apiClient.put<{ attendance: Attendance }>('/attendance', { roomId, month, absentDays });
    return response.data.attendance;
  },
};
