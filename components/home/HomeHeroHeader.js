import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

function HomeHeroHeader({ trackCount }) {
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>Karaoke</Text>
      <Text style={styles.title}>Sing along</Text>
      <Text style={styles.subtitle}>
        Pick a track, follow the lyrics, and start performing.
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statText}>{trackCount || 0} tracks</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statText}>Synced LRC</Text>
        </View>
      </View>
    </View>
  );
}

export default memo(HomeHeroHeader);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
  },
  kicker: {
    color: "#a5b4fc",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 6,
  },
  subtitle: {
    color: "#9aa4b2",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
  statPill: {
    backgroundColor: "rgba(165, 180, 252, 0.12)",
    borderColor: "rgba(165, 180, 252, 0.35)",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statText: {
    color: "#c7d2fe",
    fontWeight: "700",
    fontSize: 12,
  },
});
