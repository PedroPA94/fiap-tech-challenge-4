import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";

export const firebaseAuthRepository = {
  getCurrentUser: () => {
    return auth.currentUser;
  },

  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    return {
      id: user.uid,
      email: user.email,
      name: user.displayName,
      token: await user.getIdToken(),
    };
  },

  logout: async () => {
    await auth.signOut();
  },

  register: async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
    });

    return {
      id: user.uid,
      email: user.email,
      name: user.displayName,
      token: await user.getIdToken(),
    };
  },
};
