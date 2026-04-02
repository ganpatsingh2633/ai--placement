import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, mockStudentUser, mockTeacherUser, mockAdminUser } from './mock-data';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const usersByRole: Record<UserRole, User> = {
  student: mockStudentUser,
  teacher: mockTeacherUser,
  admin: mockAdminUser,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => setUser(usersByRole[role]);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
