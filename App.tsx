import { StyleSheet, Text, View } from 'react-native';
import {StatusBar} from "expo-status-bar";
import Map from "./components/Map/Map"

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
