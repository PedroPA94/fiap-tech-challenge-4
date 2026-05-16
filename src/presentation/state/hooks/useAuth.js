import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register, logout } from "../auth/authThunks";
import { clearError, setUser } from "../auth/authSlice";
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
        const session = await authTokenManager.getSession();

        setSecureToken(session?.token ?? null);
        setSecureUserData(session?.user ?? null);
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação segura:", error);
      } finally {
        setIsLoadingSecure(false);
      }
    };

    loadSecureData();
  }, [dispatch]);

  const user = state.user ? makeUser(state.user) : null;

  return {
    ...state,
    user,
    isAuthenticated: !isLoadingSecure && !!state.user,
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
