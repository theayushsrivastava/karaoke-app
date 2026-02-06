import React, { memo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const API_HOST = "http://46.202.163.206:5000";

function toAbsoluteUrl(maybeRelativeUrl) {
  if (!maybeRelativeUrl) return null;
  if (typeof maybeRelativeUrl !== "string") return null;
  if (/^https?:\/\//i.test(maybeRelativeUrl)) return maybeRelativeUrl;
  return `${API_HOST}/${maybeRelativeUrl.replace(/^\//, "")}`;
}

function TrackHeader({ track, audioUrl, lrcUrl, lyricsLoading }) {
  const coverUri = toAbsoluteUrl(track?.cover_path);

  return (
    <View style={styles.container}>
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder} />
      )}

      <Text style={styles.title} numberOfLines={1}>
        {track?.name || "Sample Track"}
      </Text>

      {track?.artist ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {track.artist}
        </Text>
      ) : null}

      {audioUrl ? (
        <Text style={styles.meta} numberOfLines={1}>
          Source: {audioUrl}
        </Text>
      ) : (
        <Text style={styles.meta}>Source: bundled sample.mp3</Text>
      )}

      {lrcUrl ? (
        <Text style={styles.meta} numberOfLines={1}>
          Lyrics: {lyricsLoading ? "loading…" : lrcUrl}
        </Text>
      ) : (
        <Text style={styles.meta}>Lyrics: bundled test lyrics</Text>
      )}
    </View>
  );
}

export default memo(TrackHeader);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },
  cover: {
    width: 110,
    height: 110,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  coverPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.72)",
    textAlign: "center",
    marginTop: 2,
  },
  meta: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.55)",
    textAlign: "center",
    marginTop: 4,
  },
});
