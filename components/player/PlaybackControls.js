import React, { memo } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function PlaybackControls({ isPlaying, onPlayPause, onReplay }) {
  return (
    <View style={styles.controls}>
      <TouchableOpacity
        onPress={onReplay}
        style={styles.secondaryBtn}
        accessibilityRole="button"
        accessibilityLabel="Replay"
      >
        <Ionicons name="refresh" size={20} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPlayPause}
        style={styles.primaryBtn}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? "Pause" : "Play"}
      >
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={26}
          color="#0f1724"
        />
      </TouchableOpacity>
    </View>
  );
}

export default memo(PlaybackControls);

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  primaryBtn: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#a5b4fc",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtn: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});
