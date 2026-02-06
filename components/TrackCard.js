import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

function formatDuration(durationMs) {
  const totalSeconds = Math.max(0, Math.floor((durationMs || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function TrackCard({ track, onPress }) {
  const coverUri = useMemo(() => {
    if (!track?.cover_path) return null;
    // NOTE: keep this consistent with your API/static hosting
    return `http://46.202.163.206:5000/${track.cover_path}`;
  }, [track?.cover_path]);

  const subtitle = useMemo(() => {
    const parts = [track?.artist, track?.album].filter(Boolean);
    return parts.join(" • ");
  }, [track?.artist, track?.album]);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open track ${track?.name || ""}${track?.artist ? ` by ${track.artist}` : ""}`}
    >
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={styles.coverPlaceholder} />
      )}

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {track?.name || "Untitled"}
        </Text>

        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{formatDuration(track?.duration_ms)}</Text>
          {track?.youtube_video?.title ? (
            <Text style={styles.ytText} numberOfLines={1}>
              ▶ {track.youtube_video.title}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(TrackCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#0b1220",
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cover: {
    width: 86,
    height: 86,
    borderRadius: 12,
    backgroundColor: "#22292f",
  },
  coverPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 12,
    backgroundColor: "#1b2630",
  },
  info: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: "#9aa4b2",
    fontSize: 13,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "space-between",
  },
  metaText: {
    color: "#7f8fa4",
    fontSize: 12,
  },
  ytText: {
    color: "#c7d2fe",
    fontSize: 12,
    flex: 1,
    textAlign: "right",
    marginLeft: 12,
  },
});
