import React, { memo } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

function SearchBar({ value, onChangeText, placeholder = "Search tracks, artists…" }) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#728197"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {value ? (
        <TouchableOpacity onPress={() => onChangeText("")} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default memo(SearchBar);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#0b1220",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 46,
    color: "#fff",
    fontSize: 14,
  },
  clearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(148, 163, 184, 0.12)",
  },
  clearText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
  },
});
