import { StyleSheet, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "../../../components/input";
import { Ionicons } from "@expo/vector-icons";

export default function TransactionDateInput({
  date,
  onDateChange,
  onDateSelect,
  showDatePicker,
  onShowDatePickerChange,
  error,
  errorMsg,
}) {
  return (
    <View>
      <TouchableOpacity
        style={styles.dateInputWrapper}
        onPress={() => onShowDatePickerChange(true)}
      >
        <Input
          label="Data"
          placeholder="DD/MM/YYYY"
          value={date}
          editable={false}
          pointerEvents="none"
          error={error}
          errorMsg={errorMsg}
          icon={<Ionicons name="calendar-outline" size={20} color="#94A3B8" />}
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateSelect}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateInputWrapper: {
    position: "relative",
  },
});
