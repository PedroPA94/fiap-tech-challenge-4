import { useDispatch, useSelector } from "react-redux";
import { login, register, logout } from "../auth/authThunks";
import { clearError } from "../auth/authSlice";
import { makeUser } from "../../../domain/entities/user";

export const useAuth = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth);

  const user = state.user ? makeUser(state.user) : null;

  return {
    ...state,
    user,
    isAuthenticated: !!state.user && !!state.token,

    login: (email, password) => dispatch(login({ email, password })).unwrap(),

    register: (name, email, password) =>
      dispatch(register({ name, email, password })).unwrap(),

    logout: () => dispatch(logout()).unwrap(),

    clearError: () => dispatch(clearError()),
  };
};
