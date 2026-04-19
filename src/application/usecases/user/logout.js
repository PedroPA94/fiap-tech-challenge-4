export const logout = async (repository) => {
  try {
    await repository.logout();
  } catch (_e) {
    throw new Error("Não foi possível realizar o logout");
  }
};
