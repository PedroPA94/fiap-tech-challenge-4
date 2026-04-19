export const makeTransaction = (data) => {
  if (!data.description?.trim()) {
    throw new Error("Descrição é obrigatória");
  }
  if (data.value === 0) {
    throw new Error("Valor não pode ser zero");
  }
  if (!["expense", "income"].includes(data.type)) {
    throw new Error("Tipo deve ser expense ou income");
  }
  if (!data.date) {
    throw new Error("Data é obrigatória");
  }

  const date = new Date(data.date);

  const value =
    data.type === "expense" ? -Math.abs(data.value) : Math.abs(data.value);

  return Object.freeze({
    id: data.id,
    userId: data.userId,
    description: data.description.trim(),
    type: data.type,
    category: data.category,
    hasReceipt: data.hasReceipt || false,
    date,
    value,

    isExpense: function () {
      return this.type === "expense";
    },
    isIncome: function () {
      return this.type === "income";
    },
    getAbsoluteValue: function () {
      return Math.abs(this.value);
    },
    matchesCategory: function (cat) {
      return this.category === cat;
    },
    matchesDate: function (dateStr) {
      if (!dateStr) return true;
      const [day, month, year] = dateStr.split("/");
      const searchDate = `${year}-${month}-${day}`;
      return this.date.toISOString().split("T")[0] === searchDate;
    },
    matchesSearch: function (query) {
      if (!query?.trim()) return true;
      return this.description.toLowerCase().includes(query.toLowerCase());
    },
    updateId: function (newId) {
      return makeTransaction({ ...this, id: newId });
    },
  });
};
