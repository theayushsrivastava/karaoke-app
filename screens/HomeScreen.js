// screens/HomeScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  RefreshControl,
} from "react-native";
import AppSafeArea from "../components/common/AppSafeArea";

import TrackCard from "../components/TrackCard";
import HomeHeroHeader from "../components/home/HomeHeroHeader";
import SearchBar from "../components/home/SearchBar";
import SectionHeader from "../components/home/SectionHeader";
import FeaturedTrackCard from "../components/home/FeaturedTrackCard";

const API_BASE =
  "http://46.202.163.206:5000/api/tracks/all?offset={offset}&limit={limit}";
const PAGE_LIMIT = 10;

function FuzzyCardPlaceholder() {
  const pulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  return (
    <Animated.View style={[styles.card, { opacity: pulse }]}>
      <View style={styles.thumbPlaceholder} />
      <View style={{ flex: 1, paddingLeft: 12 }}>
        <View style={styles.linePlaceholder} />
        <View style={[styles.linePlaceholder, { width: "60%", marginTop: 8 }]} />
      </View>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true); // initial load
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const abortRef = useRef(null);

  const featuredTracks = tracks.slice(0, 6);
  const filteredTracks = query.trim()
    ? tracks.filter((t) => {
        const q = query.trim().toLowerCase();
        const hay = `${t?.name || ""} ${t?.artist || ""} ${t?.album || ""}`.toLowerCase();
        return hay.includes(q);
      })
    : tracks;

  const fetchTracks = async (start = 0, append = false) => {
    const url = API_BASE.replace("{offset}", start).replace("{limit}", PAGE_LIMIT);
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      // Abort previous if any
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();
      const resp = await fetch(url, { signal: abortRef.current.signal });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const json = await resp.json();

      const received = json.tracks || [];
      setTracks((prev) => (append ? [...prev, ...received] : received));
      setHasMore(received.length >= PAGE_LIMIT);
      setOffset(start + received.length);
    } catch (err) {
      if (err.name === "AbortError") {
        // ignore
      } else {
        console.warn("Failed to fetch tracks:", err.message || err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTracks(0, false);
    // cleanup on unmount
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setOffset(0);
    fetchTracks(0, false);
  };

  const handleLoadMore = () => {
    if (loadingMore || loading || !hasMore) return;
    fetchTracks(offset, true);
  };

  const renderTrackCard = ({ item }) => (
    <View style={{ paddingHorizontal: 16 }}>
      <TrackCard
        track={item}
        onPress={() => navigation.navigate("Player", { track: item })}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 12 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const listHeader = (
    <View>
      <HomeHeroHeader trackCount={tracks.length} />
      <SearchBar value={query} onChangeText={setQuery} />

      {featuredTracks.length > 0 ? (
        <View style={{ marginBottom: 10 }}>
          <SectionHeader title="Featured" actionLabel="See all" onPressAction={() => {}} />
          <FlatList
            data={featuredTracks}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            renderItem={({ item }) => (
              <FeaturedTrackCard
                track={item}
                onPress={() => navigation.navigate("Player", { track: item })}
              />
            )}
          />
        </View>
      ) : null}

      <SectionHeader title={query.trim() ? "Results" : "All tracks"} />
    </View>
  );

  return (
    <AppSafeArea style={styles.container}>
      {loading && tracks.length === 0 ? (
        <View>
          <HomeHeroHeader trackCount={0} />
          <SearchBar value={query} onChangeText={setQuery} />
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FuzzyCardPlaceholder key={i} />
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredTracks}
          keyExtractor={(item) => item._id}
          renderItem={renderTrackCard}
          onEndReached={query.trim() ? undefined : handleLoadMore}
          onEndReachedThreshold={0.6}
          ListFooterComponent={query.trim() ? null : renderFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListHeaderComponent={listHeader}
          contentContainerStyle={{ paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        />
      )}
    </AppSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1724", // dark navy
    paddingTop: 8,
  },
  // placeholder card container (TrackCard has its own styles)
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
  // placeholders
  thumbPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 12,
    backgroundColor: "#1b2630",
  },
  linePlaceholder: {
    height: 14,
    backgroundColor: "#1b2630",
    borderRadius: 8,
    width: "80%",
  },
});
