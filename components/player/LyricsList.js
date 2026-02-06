import React, { memo, useCallback } from "react";
import { FlatList, Text, StyleSheet, Platform, View } from "react-native";

function LyricsList({ lyrics, currentIndex, flatRef, onPressLyric }) {
  const keyExtractor = useCallback((_, idx) => String(idx), []);

  // FlatList requires getItemLayout to make scrollToIndex stable
  const getItemLayout = useCallback((_, index) => {
    const lineHeight = 36; // keep in sync with styles.lineText margins
    return { length: lineHeight, offset: lineHeight * index, index };
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      const active = index === currentIndex;
      return (
        <Text
          onPress={() => onPressLyric(index)}
          style={[styles.lineText, active && styles.activeLine]}
        >
          {item.text}
        </Text>
      );
    },
    [currentIndex, onPressLyric]
  );

  if (!lyrics || lyrics.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No lyrics found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={lyrics}
      ref={flatRef}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 22, paddingHorizontal: 10 }}
      getItemLayout={getItemLayout}
      initialNumToRender={30}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default memo(LyricsList);

const styles = StyleSheet.create({
  lineText: {
    fontSize: 18,
    marginVertical: 7,
    lineHeight: 24,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.55)",
    paddingHorizontal: 8,
  },
  activeLine: {
    color: "#ffffff",
    backgroundColor: "rgba(165, 180, 252, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(165, 180, 252, 0.35)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    fontWeight: "900",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
});
