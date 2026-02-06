import React, { memo, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const API_HOST = "http://46.202.163.206:5000";

function toAbsoluteUrl(maybeRelativeUrl) {
  if (!maybeRelativeUrl) return null;
  if (typeof maybeRelativeUrl !== "string") return null;
  if (/^https?:\/\//i.test(maybeRelativeUrl)) return maybeRelativeUrl;
  return `${API_HOST}/${maybeRelativeUrl.replace(/^\//, "")}`;
}

function FeaturedTrackCard({ track, onPress }) {
  const coverUri = useMemo(() => toAbsoluteUrl(track?.cover_path), [track?.cover_path]);
  const subtitle = useMemo(() => {
    const parts = [track?.artist, track?.album].filter(Boolean);
    return parts.join(" • ");
  }, [track?.artist, track?.album]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Play ${track?.name || "track"}`}
    >
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder} />
      )}

      <Text numberOfLines={1} style={styles.title}>
        {track?.name || "Untitled"}
      </Text>
      {subtitle ? (
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

export default memo(FeaturedTrackCard);

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: "#0b1220",
    borderRadius: 18,
    padding: 12,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.16)",
  },
  cover: {
    width: "100%",
    height: 110,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#1b2630",
  },
  coverPlaceholder: {
    width: "100%",
    height: 110,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#1b2630",
  },
  title: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  subtitle: {
    color: "#9aa4b2",
    fontSize: 12,
    marginTop: 4,
  },
});
