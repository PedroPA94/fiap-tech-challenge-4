import { makeUser } from "../../../domain/entities/user";

export const login = async (repository, email, password) => {
  try {
    const user = await repository.login(email, password);

    const userData = makeUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: userData,
      token: user.token,
    };
  } catch (_e) {
    throw new Error("Falha ao realizar login");
  }
};
