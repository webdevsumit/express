import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import LottieView from "lottie-react-native";

function App() {
  const webViewRef = useRef(null);
  const [visitedUrls, setVisitedUrls] = useState([]);

  const runFirst = `
      document.addEventListener('touchmove', function(event) {
        event.preventDefault();
      }, { passive: false });
      true;
  `;

  const runBeforeFirst = `
      window.isNativeApp = true;
      true; // note: this is required, or you'll sometimes get silent failures
  `;

  const loaderView = () => {
    return (
      <LottieView
        source={require('./assets/animation_ll6w89en.json')}
        style={styles.animation}
        autoPlay
      />
    );
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (visitedUrls.length > 1) {
        webViewRef.current.goBack();
        setVisitedUrls(prevUrls => prevUrls.slice(0, -1)); // Remove the current URL from the history
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [visitedUrls]);

  const handleNavigationStateChange = newState => {
    // Store the current URL in the history when the navigation state changes
    if (
      newState.url === 'https://ca.nativeappsai.com/2/list' ||
      newState.url === 'https://ca.nativeappsai.com/2/signup'
    ) {
      setVisitedUrls([newState.url]);
    } else {
      setVisitedUrls(prevUrls => [...prevUrls, newState.url]);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <WebView
          ref={webViewRef}
          source={{uri: 'https://ca.nativeappsai.com/2/list'}}
          style={{flex: 1, marginHorizontal: 2}}
          bounces={false}
          onMessage={event => {}}
          injectedJavaScript={runFirst}
          injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
          onNavigationStateChange={handleNavigationStateChange}
          renderLoading={loaderView}
          startInLoadingState={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
  },
  animation: {
    width: '100%',
    height: '100%',
    backgroundColor: 'red'
  },
});

export default App;
