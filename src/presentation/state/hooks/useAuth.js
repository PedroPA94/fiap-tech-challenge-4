import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register, logout } from "../auth/authThunks";
import { clearError } from "../auth/authSlice";
import { makeUser } from "../../../domain/entities/user";
import { authTokenManager } from "../../../infrastructure/security/authTokenManager";

export const useAuth = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth);

  const [secureToken, setSecureToken] = useState(null);
  const [secureUserData, setSecureUserData] = useState(null);
  const [isLoadingSecure, setIsLoadingSecure] = useState(true);

  useEffect(() => {
    const loadSecureData = async () => {
      try {
        const token = await authTokenManager.getToken();
        const userData = await authTokenManager.getUserData();

        setSecureToken(token);
        setSecureUserData(userData);
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação segura:", error);
      } finally {
        setIsLoadingSecure(false);
      }
    };

    loadSecureData();
  }, []);

  const user = state.user ? makeUser(state.user) : null;

  return {
    ...state,
    user,
    isAuthenticated: !!state.user && !!secureToken,
    secureToken,
    secureUserData,
    isLoadingSecure,

    login: (email, password) => dispatch(login({ email, password })).unwrap(),

    register: (name, email, password) =>
      dispatch(register({ name, email, password })).unwrap(),

    logout: () => dispatch(logout()).unwrap(),

    clearError: () => dispatch(clearError()),
  };
};
