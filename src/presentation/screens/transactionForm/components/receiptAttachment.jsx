import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Typography from "../../../components/typography";
import { colors, radius, spacing, typography } from "../../../styles/theme";
import { useState } from "react";

import * as DocumentPicker from "expo-document-picker";
import PropTypes from "prop-types";

const MAX_FILE_SIZE = 300 * 1024; // 300KB

export default function ReceiptAttachment({ onChange, error, errorMsg }) {
  const [fileName, setFileName] = useState(null);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      if (file.size && file.size > MAX_FILE_SIZE) {
        Alert.alert(
          "Arquivo muito grande",
          "O comprovante deve ter no máximo 300KB",
        );
        return;
      }

      setFileName(file.name);

      onChange?.({
        uri: file.uri,
        mimeType: file.mimeType,
        size: file.size,
        name: file.name,
      });
    } catch (_e) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo");
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.receiptPlaceholder,
          error && { borderColor: colors.danger },
        ]}
        onPress={handlePickFile}
        activeOpacity={0.7}
      >
        <Ionicons name="attach" size={24} color={colors.textSecondary} />

        <Typography style={styles.receiptText}>
          {fileName ? `Arquivo: ${fileName}` : "Anexar comprovante (até 300KB)"}
        </Typography>
      </TouchableOpacity>
      {error && <Typography style={styles.errorText}>{errorMsg}</Typography>}
    </>
  );
}

ReceiptAttachment.propTypes = {
  onChange: PropTypes.func,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
};

ReceiptAttachment.defaultProps = {
  onChange: undefined,
  error: false,
  errorMsg: "",
};

const styles = StyleSheet.create({
  receiptPlaceholder: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.xxl,
    alignItems: "center",
    gap: spacing.sm,
  },
  receiptText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.size.xs,
  },
});
