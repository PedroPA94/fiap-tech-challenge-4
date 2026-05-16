import { makeUser, validatePassword } from "../../../domain/entities/user";

export const register = async (repository, name, email, password) => {
  try {
    validatePassword(password);

    const user = await repository.register(name, email, password);

    const userData = makeUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return { user: userData, token: user.token };
  } catch (e) {
    console.log("Register use case error:", e);
    throw new Error("Não foi possível realizar o cadastro");
  }
};
