export const makeUser = (data) => {
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error("Email inválido");
  }
  if (!data.name?.trim()) {
    throw new Error("Nome é obrigatório");
  }

  return Object.freeze({
    id: data.id,
    email: data.email.toLowerCase(),
    name: data.name.trim(),

    isEmailValid: function () {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    },

    getFirstName: function () {
      return this.name.split(" ")[0];
    },

    toJSON() {
      return {
        id: this.id,
        email: this.email,
        name: this.name,
      };
    },
  });
};
