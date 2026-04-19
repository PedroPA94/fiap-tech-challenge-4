import { auth } from "../../../firebase/config";

export const firebaseAuthRepository = {
  getCurrentUser: () => {
    return auth.currentUser;
  },
};
