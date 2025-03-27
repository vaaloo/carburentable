import { StatusBar } from 'expo-status-bar';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Footer from "./layout/Footer/Footer";
import {dataHook} from "./hook/dataHook";
export default function App() {
  const { data } = dataHook("13100");
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: 'relative',
    padding: 5,
    flex: 1,
    backgroundColor: '#fff',
  },
});
