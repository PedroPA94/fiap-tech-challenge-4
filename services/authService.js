import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/config";
import { makeUser } from "../src/domain/entities/user";

export const authService = {
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      const userData = makeUser({
        id: user.uid,
        email: user.email,
        name: user.displayName,
      });

      return {
        user: userData,
        token: await user.getIdToken(),
      };
    } catch (error) {
      throw new Error("Falha ao realizar login");
    }
  },

  register: async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      const userData = makeUser({
        id: user.uid,
        email: user.email,
        name: name,
      });

      return {
        user: userData,
        token: await user.getIdToken(),
      };
    } catch (error) {
      throw new Error("Não foi possível realizar o cadastro");
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
