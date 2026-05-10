import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Button from "../../components/button";
import Input from "../../components/input";
import Typography from "../../components/typography";
import { colors, spacing, typography } from "../../styles/theme";
import { useForm } from "../../hooks/useForm";
import { useValidators } from "../../hooks/useValidators";
import TransactionTypeSelector from "./components/transactionTypeSelector";
import TransactionValueInput from "./components/transactionValueInput";
import TransactionCategorySelector from "./components/transactionCategorySelector";
import TransactionDateInput from "./components/transactionDateInput";
import ReceiptAttachment from "./components/receiptAttachment";
import { getTransactionById as getTransactionByIdUC } from "../../../application/usecases/transaction";
import { getCurrentUser as getCurrentUserUC } from "../../../application/usecases/user";
import { firebaseTransactionRepository } from "../../../infrastructure/repositories/firebaseTransactionRepository";
import { firebaseAuthRepository } from "../../../infrastructure/repositories/firebaseAuthRepository";
import { useTransactions } from "../../state/hooks/useTransactions";

export default function TransactionFormScreen() {
  const ACCEPTED_FILE_TYPES = ["image/*", "application/pdf"];
  const MAX_FILE_SIZE = 300 * 1024; // 300KB

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isEditing = !!id;
  const { addTransaction, updateTransaction, isLoading } = useTransactions();

  const { validateText, validateValue, CHAR_LIMITS } = useValidators();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const initialValues = {
    type: "expense",
    value: "",
    category: "",
    description: "",
    date: new Date().toLocaleDateString("pt-BR"),
    receipt: null,
  };

  const validateFormData = (values) => {
    const errors = {};

    const valueError = validateValue(values.value, true);
    if (valueError) {
      errors.value = valueError;
    }

    if (!values.category) {
      errors.category = "Categoria obrigatória";
    }

    const descriptionError = validateText(
      values.description,
      3,
      CHAR_LIMITS.description,
      true,
    );
    if (descriptionError) {
      errors.description = descriptionError;
    }

    if (!values.date) {
      errors.date = "Data obrigatória";
    }

    if (values.receipt) {
      if (typeof values.receipt !== "object") {
        errors.receipt = "Formato de comprovante inválido";
      } else if (
        !ACCEPTED_FILE_TYPES.includes(values.receipt.mimeType) ||
        values.receipt.size > MAX_FILE_SIZE
      ) {
        errors.receipt =
          "Comprovante deve ser imagem ou PDF e ter no máximo 300KB";
      }
    }

    return errors;
  };

  const { values, errors, handleFormChange, handleFormSubmit } = useForm(
    initialValues,
    validateFormData,
  );

  useEffect(() => {
    if (!isEditing) return;

    const loadTransaction = async () => {
      try {
        const user = getCurrentUserUC(firebaseAuthRepository);
        const transaction = await getTransactionByIdUC(
          id,
          user.uid,
          firebaseTransactionRepository,
        );

        const date = new Date(transaction.date);
        const formattedDate =
          String(date.getDate()).padStart(2, "0") +
          "/" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "/" +
          date.getFullYear();

        handleFormChange("type", transaction.type);
        handleFormChange("value", Math.abs(transaction.value).toString());
        handleFormChange("category", transaction.category);
        handleFormChange("description", transaction.description);
        handleFormChange("date", formattedDate);

        if (transaction.receipt) {
          handleFormChange("receipt", transaction.receipt);
        }
      } catch (_e) {
        Alert.alert("Erro", "Falha ao carregar transação");
        router.back();
      }
    };

    loadTransaction();
  }, [id]);

  const handleClose = () => {
    router.back();
  };

  const handleSaveTransaction = async (validValues) => {
    setSaveError(null);

    try {
      // Converter data no formato "dd/mm/yyyy" para ISO "yyyy-mm-dd"
      const dateParts = validValues.date.split("/");
      const isoDate =
        dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0] + "T00:00:00";

      const transactionData = {
        type: validValues.type,
        value: parseFloat(validValues.value.replace(",", ".")),
        category: validValues.category,
        description: validValues.description,
        date: isoDate,
        receipt: validValues.receipt,
      };

      if (isEditing) {
        await updateTransaction(id, transactionData);
        Alert.alert("Sucesso", "Transação atualizada com sucesso!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        await addTransaction(transactionData);
        Alert.alert("Sucesso", "Transação criada com sucesso!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      setSaveError(error.message);
      Alert.alert("Erro", "Falha ao salvar transação: " + error.message);
    }
  };

  const handleTypeChange = (newType) => {
    handleFormChange("type", newType);
    if (newType === "income") {
      handleFormChange("category", "income");
    } else {
      handleFormChange("category", "");
    }
    setShowCategoryPicker(false);
  };

  const handleDateSelect = (event, date) => {
    setShowDatePicker(false);

    if (!date || event.type === "dismissed") {
      handleFormChange("date", new Date().toISOString().split("T")[0]);
      return;
    }

    const formatted =
      String(date.getDate()).padStart(2, "0") +
      "/" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "/" +
      date.getFullYear();

    handleFormChange("date", formatted);
  };

  const handleCategoryChange = (newCategory) => {
    handleFormChange("category", newCategory);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View
          style={styles.header}
          entering={SlideInDown.duration(400).springify()}
        >
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Typography weight="bold" style={styles.headerTitle}>
            {isEditing ? "Editar transação" : "Nova transação"}
          </Typography>
          <View style={styles.headerSpacer} />
        </Animated.View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={SlideInDown.delay(100).duration(400).springify()}
          >
            <TransactionTypeSelector
              type={values.type}
              onTypeChange={handleTypeChange}
            />

            <TransactionValueInput
              type={values.type}
              value={values.value}
              onChangeText={(text) => handleFormChange("value", text)}
              error={!!errors.value}
              errorMsg={errors.value}
            />

            <View style={styles.formFields}>
              <TransactionCategorySelector
                type={values.type}
                category={values.category}
                onCategoryChange={handleCategoryChange}
                showCategoryPicker={showCategoryPicker}
                onShowPickerChange={setShowCategoryPicker}
                error={!!errors.category}
                errorMsg={errors.category}
              />

              <Input
                label="Descrição"
                placeholder="Ex: Compras no mercado"
                value={values.description}
                onChangeText={(text) => handleFormChange("description", text)}
                error={!!errors.description}
                errorMsg={errors.description}
                icon={
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#94A3B8"
                  />
                }
              />

              <TransactionDateInput
                date={values.date}
                onDateChange={handleFormChange}
                onDateSelect={handleDateSelect}
                showDatePicker={showDatePicker}
                onShowDatePickerChange={setShowDatePicker}
                error={!!errors.date}
                errorMsg={errors.date}
              />

              <ReceiptAttachment
                onChange={(file) => handleFormChange("receipt", file)}
                error={!!errors.receipt}
                errorMsg={errors.receipt}
              />
            </View>
          </Animated.View>
        </ScrollView>

        <Animated.View
          style={styles.footer}
          entering={SlideInDown.delay(200).duration(400).springify()}
        >
          {saveError && (
            <View style={styles.errorContainer}>
              <Typography style={styles.errorText}>{saveError}</Typography>
            </View>
          )}
          <Button
            onPress={() => handleFormSubmit(handleSaveTransaction)}
            style={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator
                  size="small"
                  color={colors.white}
                  style={{ marginRight: spacing.sm }}
                />
                <Typography weight="bold">Salvando...</Typography>
              </View>
            ) : (
              "Salvar transação"
            )}
          </Button>
          <Button secondary onPress={handleClose} style={styles.cancelButton}>
            Cancelar
          </Button>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.size.lg,
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  formFields: {
    gap: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  submitButton: {
    marginBottom: spacing.sm,
  },
  cancelButton: {
    marginBottom: spacing.sm,
  },
  errorContainer: {
    backgroundColor: colors.error || "#FEE2E2",
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.textError || "#DC2626",
    fontSize: typography.size.sm,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
