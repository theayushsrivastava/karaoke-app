import React, { memo } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

function PlayerBackground({ coverUri, children }) {
  if (!coverUri) {
    return <View style={styles.fallback}>{children}</View>;
  }

  return (
    <ImageBackground
      source={{ uri: coverUri }}
      style={styles.bg}
      resizeMode="cover"
      blurRadius={22}
    >
      <View style={styles.overlay} />
      {children}
    </ImageBackground>
  );
}

export default memo(PlayerBackground);

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#0f1724",
  },
  fallback: {
    flex: 1,
    backgroundColor: "#0f1724",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 36, 0.78)",
  },
});
