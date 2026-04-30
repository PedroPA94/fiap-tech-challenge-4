export const makeSummary = (data) => {
  if (!data.userId) {
    throw new Error("userId é obrigatório");
  }

  const totalIncome = Number(data.totalIncome || 0);
  const totalExpenses = Number(data.totalExpenses || 0);
  const balance = Number(
    data.balance !== undefined ? data.balance : totalIncome - totalExpenses,
  );

  const updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

  return Object.freeze({
    userId: data.userId,
    totalIncome,
    totalExpenses,
    balance,
    updatedAt,

    toJSON() {
      return {
        userId: this.userId,
        totalIncome: this.totalIncome,
        totalExpenses: this.totalExpenses,
        balance: this.balance,
        updatedAt: this.updatedAt.toISOString(),
      };
    },
  });
};
