import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  address: string;
  sdt: string;
}

export interface RegisterData {
  username: string;
  password: string;
  name?: string;
  email: string;
  address?: string;
  sdt?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => { success: boolean; message?: string };
  register: (data: RegisterData) => { success: boolean; message?: string };
  logout: () => void;
}

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: "tranductri",
    password: "123",
    name: "Trần Đức Trí",
    email: "tranductri@gmail.com",
    address: "Thủ Đức, TP. Hồ Chí Minh",
    sdt: "0901234567"
  },
  {
    id: 2,
    username: "minhkhang",
    password: "123",
    name: "Lê Minh Khang",
    email: "minhkhang@gmail.com",
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    sdt: "0912345678"
  },
  {
    id: 3,
    username: "giakhanh",
    password: "123",
    name: "Nguyễn Gia Khánh",
    email: "giakhanh@gmail.com",
    address: "Quận 1, TP. Hồ Chí Minh",
    sdt: "0923456789"
  },
  {
    id: 4,
    username: "huuthinh",
    password: "123",
    name: "Phạm Hữu Thịnh",
    email: "huuthinh@gmail.com",
    address: "Quận 3, TP. Hồ Chí Minh",
    sdt: "0934567890"
  },
  {
    id: 5,
    username: "thanhdung",
    password: "123",
    name: "Hoàng Thanh Dung",
    email: "thanhdung@gmail.com",
    address: "Quận 5, TP. Hồ Chí Minh",
    sdt: "0945678901"
  }
];

const AuthContext = createContext<AuthContextType | null>(null);

const getUsers = (): User[] => {
  const saved = localStorage.getItem('users');
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem('users', JSON.stringify(MOCK_USERS));
  return MOCK_USERS;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username: string, password: string) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.username === username || u.email === username
    );

    if (!found || found.password !== password) {
      return { success: false, message: 'Sai tên người dùng hoặc mật khẩu ' };
    }

    setUser(found);
    localStorage.setItem('user', JSON.stringify(found));
    return { success: true };
  };

  const register = (data: RegisterData) => {
    const users = getUsers();

    if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, message: 'Tên người dùng đã tồn tại' };
    }

    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'Email đã được đăng ký' };
    }

    const newUser: User = {
      id: Date.now(),
      username: data.username,
      password: data.password,
      name: data.name || data.username,
      email: data.email,
      address: data.address || '',
      sdt: data.sdt || '',
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
