import React, { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * App-wide safe area wrapper.
 * Defaults to respecting both top + bottom (status bar + home indicator).
 */
function AppSafeArea({ children, style, edges = ["top", "bottom", "left", "right"] }) {
  return (
    <SafeAreaView style={style} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

export default memo(AppSafeArea);
