export const colors = {
  primary: "#2563eb",
  primarySoft: "#FFFFFF20",
  background: "#f8fafc",
  textPrimary: "#0f172a",
  textSecondary: "#64728b",
  white: "#ffffff",
  black: "#000000",
  border: "#e2e6eb",
  danger: "#d4183d",
  success: "#10b981",
};

export const categories = {
  home: {
    icon: "home-sharp",
    label: "Casa",
    baseColor: "#3ed9f5",
    softColor: "#3ed9f520",
  },
  education: {
    icon: "school",
    label: "Educação",
    baseColor: "#1c4fbe",
    softColor: "#1c4fbe20",
  },
  transport: {
    icon: "car",
    label: "Transporte",
    baseColor: "#b4b102",
    softColor: "#b4b10220",
  },
  food: {
    icon: "restaurant",
    label: "Alimentação",
    baseColor: "#d47406",
    softColor: "#d4740620",
  },
  leisure: {
    icon: "happy",
    label: "Lazer",
    baseColor: "#750bb3",
    softColor: "#750bb320",
  },
  health: {
    icon: "medkit",
    label: "Saúde",
    baseColor: "#f829b3",
    softColor: "#f829b320",
  },
  other: {
    icon: "ellipsis-horizontal-circle",
    label: "Outros",
    baseColor: "#696969",
    softColor: "#69696920",
  },
  income: {
    icon: "logo-usd",
    label: "Receita",
    baseColor: "#10b981",
    softColor: "#10b98120",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

export const typography = {
  fontFamily: {
    regular: "Inter_400Regular",
    semibold: "Inter_600SemiBold",
  },
  size: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 30,
  },
};

export const shadow = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.65,
  shadowRadius: 12,
  elevation: 6,
};

export const shadowNeutral = {
  ...shadow,
  shadowColor: colors.black,
  shadowOpacity: 0.15,
};
