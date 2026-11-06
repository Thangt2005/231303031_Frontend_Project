import { createContext, useContext, useState } from 'react';

export const MOCK_USERS = [
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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const found = MOCK_USERS.find(
      (u) => u.username === username || u.email === username
    );

    if (!found || found.password !== password) {
      return { success: false, message: 'Sai tên người dùng hoặc mật khẩu ' };
    }

    setUser(found);
    localStorage.setItem('user', JSON.stringify(found));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
