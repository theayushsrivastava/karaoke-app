import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function SectionHeader({ title, actionLabel, onPressAction }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onPressAction} hitSlop={12}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default memo(SectionHeader);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  action: {
    color: "#a5b4fc",
    fontWeight: "800",
    fontSize: 13,
  },
});
