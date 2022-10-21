import {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import * as QuickSQLite from 'react-native-quick-sqlite';

import type {QuickSQLiteConnection} from 'react-native-quick-sqlite';

type DatabaseConnection = QuickSQLiteConnection | null;

function App() {
  let dbName = 'example.db';
  let [db, setDb] = useState<DatabaseConnection>(null);

  useEffect(() => {
    if (db) return;

    let result = QuickSQLite.open({name: dbName});
    setDb(result);
  }, [dbName]);

  console.log(db);

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
