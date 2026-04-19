import { useState } from "react";

export function useForm(initialValues, validationFn) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // limpa erro ao digitar
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = (onValidFn) => {
    const validationErrors = validationFn(values);
    setErrors(validationErrors);

    if (onValidFn && Object.keys(validationErrors).length === 0) {
      onValidFn(values);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
}
