import { View, StyleSheet, Button } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import {testLyrics} from '../assets/lyrics';
import { parseLRC } from '../utils/lrcParser';

const audioSource = require('../assets/sample.mp3');
import { ScrollView, Text } from 'react-native';

export default function App() {
  const player = useAudioPlayer(audioSource);
  const parsedLyrics = parseLRC(testLyrics);

    console.log(parsedLyrics);

  return (
    <View style={styles.container}>
        <ScrollView style={{ marginBottom: 20 }}>
            {parsedLyrics.map((line, idx) => (
                <Text key={idx} style={{ fontSize: 18, marginVertical: 4 }}>
                    {line.text}
                </Text>
            ))}
        </ScrollView>
    
      <Button title="Play Sound" onPress={() => player.play()} />
      <Button
        title="Replay Sound"
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
