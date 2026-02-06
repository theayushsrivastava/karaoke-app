import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function PlayerTopBar({ title = "Player", onPressBack }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPressBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.iconBtn}
        hitSlop={10}
      >
        <Ionicons name="chevron-back" size={22} color="#ffffff" />
      </TouchableOpacity>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={{ width: 40 }} />
    </View>
  );
}

export default memo(PlayerTopBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 6,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  title: {
    flex: 1,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
