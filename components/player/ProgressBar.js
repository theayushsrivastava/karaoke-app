import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

function formatTime(ms) {
  const totalSec = Math.max(0, Math.floor((ms || 0) / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function ProgressBar({ positionMs = 0, durationMs = 0 }) {
  const progress = useMemo(() => {
    if (!durationMs) return 0;
    return Math.min(1, Math.max(0, positionMs / durationMs));
  }, [positionMs, durationMs]);

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
        <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

export default memo(ProgressBar);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timeText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 12,
    fontWeight: "700",
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  fill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#a5b4fc",
  },
});
