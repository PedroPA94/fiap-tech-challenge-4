import { createContext, useContext, useState, useCallback } from "react";
import {
  login as loginUC,
  register as registerUC,
  logout as logoutUC,
} from "../../application/usecases/user";
import { firebaseAuthRepository } from "../../infrastructure/repositories/firebaseAuthRepository";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: userData, token: authToken } = await loginUC(
        firebaseAuthRepository,
        email,
        password,
      );
      setUser(userData);
      setToken(authToken);
      return { user: userData, token: authToken };
    } catch (err) {
      const errorMessage = err.message || "Erro ao fazer login";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: userData, token: authToken } = await registerUC(
        firebaseAuthRepository,
        name,
        email,
        password,
      );
      setUser(userData);
      setToken(authToken);
      return { user: userData, token: authToken };
    } catch (err) {
      const errorMessage = err.message || "Erro ao criar conta";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logoutUC(firebaseAuthRepository);
      setUser(null);
      setToken(null);
    } catch (err) {
      const errorMessage = err.message || "Erro ao fazer logout";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
