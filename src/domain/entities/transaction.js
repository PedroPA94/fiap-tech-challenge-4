import { sanitizationUtils } from "../utils/sanitizationUtils";

const ACCEPTED_FILE_TYPES = ["image/*", "application/pdf"];
const MAX_FILE_SIZE = 300 * 1024; // 300KB

// Limites de caracteres
const CONSTRAINTS = {
  description: { min: 3, max: 500 },
};

export const makeTransaction = (data) => {
  const sanitizedDescription = sanitizationUtils.sanitizeText(
    data.description,
    CONSTRAINTS.description.max,
  );
  const sanitizedCategory = sanitizationUtils.sanitizeText(data.category, 50);

  if (!sanitizedDescription?.trim()) {
    throw new Error("Descrição é obrigatória");
  }

  if (
    !sanitizationUtils.validateLength(
      sanitizedDescription,
      CONSTRAINTS.description.min,
      CONSTRAINTS.description.max,
    )
  ) {
    throw new Error(
      `Descrição deve ter entre ${CONSTRAINTS.description.min} e ${CONSTRAINTS.description.max} caracteres`,
    );
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

  if (data.receipt) {
    if (typeof data.receipt !== "object") {
      throw new Error("Formato de comprovante inválido");
    }
    if (
      !ACCEPTED_FILE_TYPES.includes(data.receipt.mimeType) ||
      data.receipt.size > MAX_FILE_SIZE
    ) {
      throw new Error(
        "Comprovante deve ser imagem ou PDF e ter no máximo 300KB",
      );
    }
  }

  const date = new Date(data.date);
  const value =
    data.type === "expense" ? -Math.abs(data.value) : Math.abs(data.value);

  return Object.freeze({
    id: data.id,
    userId: data.userId,
    description: sanitizationUtils.normalizeWhitespace(sanitizedDescription),
    type: data.type,
    category: sanitizedCategory,
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
    toJSON() {
      return {
        id: this.id,
        userId: this.userId,
        description: this.description,
        type: this.type,
        category: this.category,
        hasReceipt: this.hasReceipt,
        date: this.date.toISOString(),
        value: this.value,
      };
    },
  });
};
