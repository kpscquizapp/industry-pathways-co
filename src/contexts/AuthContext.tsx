import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'employer';
  avatar?: string;
  phone?: string;
  location?: string;
  experience?: string;
  currentRole?: string;
  resumeUrl?: string;
  skills?: string[];
  lookingForContract?: boolean;
  validatedSkills?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'candidate' | 'employer') => Promise<boolean>;
  signup: (email: string, password: string, name: string, role?: 'candidate' | 'employer', lookingForContract?: boolean) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('hirion_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: 'candidate' | 'employer' = 'candidate'): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('hirion_users') || '[]');
    let foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    // Return existing user if found
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('hirion_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    // Auto-create user with any credentials
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name: email.split('@')[0],
      role,
      avatar: email.charAt(0).toUpperCase(),
    };

    users.push(newUser);
    localStorage.setItem('hirion_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('hirion_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const signup = async (email: string, password: string, name: string, role: 'candidate' | 'employer' = 'candidate', lookingForContract?: boolean): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('hirion_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role,
      avatar: name.charAt(0).toUpperCase(),
      lookingForContract: lookingForContract || false,
    };

    users.push(newUser);
    localStorage.setItem('hirion_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('hirion_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hirion_user');
  };

  const updateProfile = (profile: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);
    localStorage.setItem('hirion_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('hirion_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profile };
      localStorage.setItem('hirion_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
