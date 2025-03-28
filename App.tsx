import { StatusBar } from 'expo-status-bar';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Footer from "./layout/Footer/Footer";
import Map from "./components/Map/Map";
import {Colors} from "react-native/Libraries/NewAppScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <Map/>
      <Footer/>
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
    borderWidth: 1,
    borderColor: Colors.white,
    borderStyle: "solid",
    backgroundColor: '#fff',
  },
});
