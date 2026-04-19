import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/config";

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
};
