export const getCurrentUser = (repository) => {
  const user = repository.getCurrentUser();

  if (!user) throw new Error("Usuário não autenticado");

  return user;
};
