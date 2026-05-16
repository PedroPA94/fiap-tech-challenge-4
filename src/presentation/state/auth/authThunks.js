import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login as loginUC,
  register as registerUC,
  logout as logoutUC,
} from "../../../application/usecases/user";
import { firebaseAuthRepository } from "../../../infrastructure/repositories/firebaseAuthRepository";
import { authTokenManager } from "../../../infrastructure/security/authTokenManager";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await loginUC(firebaseAuthRepository, email, password);

      await authTokenManager.saveSession({
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
      });

      return {
        user: result.user.toJSON(),
      };
    } catch (err) {
      return rejectWithValue(err.message || "Erro ao fazer login");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const result = await registerUC(
        firebaseAuthRepository,
        name,
        email,
        password,
      );

      await authTokenManager.saveSession({
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
      });

      return {
        user: result.user.toJSON(),
      };
    } catch (err) {
      return rejectWithValue(err.message || "Erro ao criar conta");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUC(firebaseAuthRepository);
      await authTokenManager.clearAll();
    } catch (err) {
      return rejectWithValue(err.message || "Erro ao fazer logout");
    }
  },
);
