import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';

function App() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#222222'}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: '#cccccc'}}>
          React Native Quick SQLite example app
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
