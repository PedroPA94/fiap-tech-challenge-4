export const logout = async (repository) => {
  try {
    await repository.logout();
  } catch (e) {
    console.log("Logout use case error:", e);
    throw new Error("Não foi possível realizar o logout");
  }
};
