// screens/PlayerScreen2.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import AppSafeArea from "../components/common/AppSafeArea";
import { Audio } from "expo-av";
import { parseLRC } from "../utils/lrcParser";
import { testLyrics } from "../assets/lyrics"; // keep your test lyrics import
import TrackHeader from "../components/player/TrackHeader";
import LyricsList from "../components/player/LyricsList";
import PlaybackControls from "../components/player/PlaybackControls";
import PlayerBackground from "../components/player/PlayerBackground";
import PlayerTopBar from "../components/player/PlayerTopBar";
import ProgressBar from "../components/player/ProgressBar";
const audioSource = require("../assets/sample.mp3");

/*
  Notes:
  - Uses expo-av Audio.Sound to get playback position via onPlaybackStatusUpdate.
  - Highlights current lyric line and scrolls it into center view.
  - If you prefer to keep your `useAudioPlayer` hook, I can adapt this to that API,
    but expo-av is the standard approach and offers fine-grained playback status updates.
*/

const API_HOST = "http://46.202.163.206:5000";

function toAbsoluteUrl(maybeRelativeUrl) {
  if (!maybeRelativeUrl) return null;
  if (typeof maybeRelativeUrl !== "string") return null;
  if (/^https?:\/\//i.test(maybeRelativeUrl)) return maybeRelativeUrl;
  return `${API_HOST}/${maybeRelativeUrl.replace(/^\//, "")}`;
}

function getTrackAudioUrl(track) {
  // NOTE: field names depend on your API. These are common possibilities.
  return (
    toAbsoluteUrl(track?.audio_url) ||
    toAbsoluteUrl(track?.audioUrl) ||
    toAbsoluteUrl(track?.audio_path) ||
    toAbsoluteUrl(track?.audioPath) ||
    toAbsoluteUrl(track?.file_path) ||
    toAbsoluteUrl(track?.filePath) ||
    toAbsoluteUrl(track?.path) ||
    toAbsoluteUrl(track?.url) ||
    null
  );
}

function getTrackLrcUrl(track) {
  return (
    toAbsoluteUrl(track?.lrc_url) ||
    toAbsoluteUrl(track?.lrcUrl) ||
    toAbsoluteUrl(track?.lrc_path) ||
    toAbsoluteUrl(track?.lrcPath) ||
    null
  );
}

function getTrackLrcText(track) {
  // If/when your API returns lyrics, prefer them; otherwise fall back.
  return track?.lyrics_lrc || track?.lrc || track?.lyrics || track?.lyrics_text || testLyrics;
}

export default function PlayerScreen2({ route, navigation }) {
  const track = route?.params?.track;

  const [sound, setSound] = useState(null);
  const soundRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioUrl = useMemo(() => getTrackAudioUrl(track), [track]);
  const lrcUrl = useMemo(() => getTrackLrcUrl(track), [track]);

  const coverUrl = useMemo(() => toAbsoluteUrl(track?.cover_path), [track?.cover_path]);

  const [lrcText, setLrcText] = useState(() => getTrackLrcText(track));
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const lrcAbortRef = useRef(null);

  // Fetch LRC when track changes (or if LRC URL exists)
  useEffect(() => {
    let mounted = true;

    const fallback = getTrackLrcText(track);
    if (!lrcUrl) {
      // No remote LRC available; fall back to embedded/test.
      setLrcText(fallback);
      return;
    }

    const load = async () => {
      try {
        setLyricsLoading(true);

        if (lrcAbortRef.current) lrcAbortRef.current.abort();
        lrcAbortRef.current = new AbortController();

        const resp = await fetch(lrcUrl, { signal: lrcAbortRef.current.signal });
        if (!resp.ok) throw new Error(`Failed to load LRC: HTTP ${resp.status}`);

        const text = await resp.text();
        if (!mounted) return;
        setLrcText(text);
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.warn("Failed to fetch LRC, using fallback:", e?.message || e);
        if (!mounted) return;
        setLrcText(fallback);
      } finally {
        if (mounted) setLyricsLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      if (lrcAbortRef.current) lrcAbortRef.current.abort();
    };
  }, [lrcUrl, track]);

  // Parse LRC to [{time: seconds, text: string}, ...]
  const lyrics = useMemo(() => parseLRC(lrcText || ""), [lrcText]);

  // Keep latest lyrics in a ref so the playback callback doesn't need to be recreated.
  const lyricsRef = useRef(lyrics);
  useEffect(() => {
    lyricsRef.current = lyrics;
  }, [lyrics]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef(null);

  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  // Avoid stale values inside expo-av callback (createAsync keeps the callback reference)
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    // We'll draw our own top bar for a karaoke-style player.
    navigation?.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Playback status callback
  const onPlaybackStatusUpdate = useCallback((status) => {
    if (!status || !status.isLoaded) return;

    if (status.isPlaying !== isPlayingRef.current) {
      setIsPlaying(status.isPlaying);
    }

    if (typeof status.positionMillis === "number") {
      setPositionMs(status.positionMillis);
    }
    if (typeof status.durationMillis === "number") {
      setDurationMs(status.durationMillis);
    }

    // current position in seconds
    const posSec = (status.positionMillis || 0) / 1000;

    const currentLyrics = lyricsRef.current || [];
    // Determine which lyric index should be active
    // We choose the last lyric whose time <= posSec
    let idx = 0;
    for (let i = 0; i < currentLyrics.length; i++) {
      if (posSec >= currentLyrics[i].time) idx = i;
      else break;
    }

    if (idx !== currentIndexRef.current) {
      currentIndexRef.current = idx;
      setCurrentIndex(idx);
      // scroll to center the active line
      if (flatRef.current) {
        try {
          flatRef.current.scrollToIndex({
            index: idx,
            animated: true,
            viewPosition: 0.45, // ~middle
          });
        } catch (e) {
          // scrollToIndex can throw if index out of range while data updates; ignore
        }
      }
    }
  }, []);

  // Load sound
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);

        // Unload previous sound (important when navigating to same screen with a new track)
        if (soundRef.current) {
          try {
            await soundRef.current.unloadAsync();
          } catch (_) {
            // ignore
          }
          soundRef.current = null;
          setSound(null);
          setIsPlaying(false);
        }

        setCurrentIndex(0);
        currentIndexRef.current = 0;

        const source = audioUrl ? { uri: audioUrl } : audioSource;

        const { sound: snd } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: false, progressUpdateIntervalMillis: 200 },
          onPlaybackStatusUpdate
        );
        if (!mounted) return;

        soundRef.current = snd;
        setSound(snd);
        setLoading(false);
      } catch (e) {
        console.error("Error loading sound:", e);
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, onPlaybackStatusUpdate]);

  // Play / Pause handlers
  const handlePlayPause = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await sound.pauseAsync();
    } else {
      // if ended, reset to start first
      if (status.positionMillis >= (status.durationMillis || 0)) {
        await sound.setPositionAsync(0);
        setCurrentIndex(0);
        currentIndexRef.current = 0;
      }
      await sound.playAsync();
    }
  };

  const handleReplay = async () => {
    if (!sound) return;
    await sound.stopAsync();
    await sound.setPositionAsync(0);
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    await sound.playAsync();
  };

  // Helpful: handle seek-to specific lyric when user taps line
  const onPressLyric = async (index) => {
    if (!sound) return;
    const timeSec = lyrics[index].time || 0;
    await sound.setPositionAsync(Math.floor(timeSec * 1000));
    setCurrentIndex(index);
    currentIndexRef.current = index;
    const status = await sound.getStatusAsync();
    if (!status.isPlaying) {
      await sound.playAsync();
    }
  };

  if (loading) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#a5b4fc" />
        <Text style={{ marginTop: 10, color: "rgba(255,255,255,0.75)" }}>
          Loading audio...
        </Text>
      </View>
    );
  }

  return (
    <PlayerBackground coverUri={coverUrl}>
      <StatusBar barStyle="light-content" />

      <AppSafeArea style={styles.container} edges={["top", "bottom", "left", "right"]}>
        <PlayerTopBar
          title={track?.name || "Player"}
          onPressBack={() => navigation.goBack()}
        />

        <TrackHeader
          track={track}
          audioUrl={audioUrl}
          lrcUrl={lrcUrl}
          lyricsLoading={lyricsLoading}
        />

        <View style={{ flex: 1 }}>
          <LyricsList
            lyrics={lyrics}
            currentIndex={currentIndex}
            flatRef={flatRef}
            onPressLyric={onPressLyric}
          />
        </View>

        <ProgressBar positionMs={positionMs} durationMs={durationMs} />

        <PlaybackControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onReplay={handleReplay}
        />

        <Text style={styles.hint}>
          Tap a line to jump to that lyric. (Parsed {lyrics.length} lines.)
        </Text>
      </AppSafeArea>
    </PlayerBackground>
  );
}

const styles = StyleSheet.create({
  containerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0f1724",
  },
  container: {
    flex: 1,
    paddingTop: 6,
  },
  hint: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 8,
  },
});
