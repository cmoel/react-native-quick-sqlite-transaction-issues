import {ReactNode, useEffect, useState} from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import * as QuickSQLite from 'react-native-quick-sqlite';

import type {GestureResponderEvent, StyleProp, ViewStyle} from 'react-native';
import type {QuickSQLiteConnection} from 'react-native-quick-sqlite';

type DatabaseConnection = QuickSQLiteConnection | null;

function App() {
  let dbName = 'example.db';
  let [db, setDb] = useState<DatabaseConnection>(null);
  let [migrated, setMigrated] = useState(false);

  useEffect(() => {
    if (db) return;

    let result = QuickSQLite.open({name: dbName});
    setDb(result);
  }, [dbName]);

  function migrateDatabaseUp() {
    if (!db) return;
    if (migrated) return;

    let createPeople = `create table if not exists
                          people (
                            id integer primary key autoincrement,
                            name text not null
                          )`;
    let createDogs = `create table if not exists
                        dogs (
                          id integer primary key autoincrement,
                          person_id integer not null,
                          name text not null
                        )`;

    db.execute(createPeople);
    db.execute(createDogs);
    setMigrated(true);
  }

  function printDatabaseContents() {
    if (!db) return;
    if (!migrated) {
      console.log('Please click Migrate database up first!');
      return;
    }

    let selectAll = `select
                       people.id as person_id,
                       dogs.id as dog_id,
                       people.name as person,
                       dogs.name as dog
                     from people
                     inner join dogs
                       on people.id = dogs.person_id`;
    db.executeAsync(selectAll).then(res => console.log('RES', res.rows));
  }

  type insertInput = {personName: string; dogName: string};

  function insert({personName, dogName}: insertInput) {
    if (!db) return;
    if (!migrated) return;

    db.transactionAsync(tx =>
      tx
        .executeAsync('insert into people (name) values (?)', [personName])
        .then(res =>
          tx.executeAsync('insert into dogs (person_id, name) values (?, ?)', [
            res.insertId,
            dogName,
          ]),
        )
        .then(() => Promise.resolve()) // without this, there's a type error that feels weird: Type 'Promise<void | QueryResult>' is not assignable to type 'Promise<void>'.
        .catch(e => console.log('ERROR', e)),
    );
  }

  function failToInsert({personName, dogName}: insertInput) {
    if (!db) return;
    if (!migrated) {
      console.log('Please click Migrate database up first!');
      return;
    }

    db.transactionAsync(tx =>
      tx
        .executeAsync('insert into people (name) values (?)', [personName])
        .then(res =>
          tx.executeAsync(
            'insert into this_table_does_not_exist_and_will_throw_an_error (person_id, name) values (?, ?)',
            [res.insertId, dogName],
          ),
        )
        .then(() => Promise.resolve()) // without this, there's a type error that feels weird: Type 'Promise<void | QueryResult>' is not assignable to type 'Promise<void>'.
        .catch(e => console.log('ERROR', e)),
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#222222'}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Button
          onPress={() => migrateDatabaseUp()}
          style={{padding: 16, marginVertical: 8}}>
          <Text style={{color: '#dddddd', textAlign: 'center'}}>
            Migrate database up
          </Text>
        </Button>
        <Button
          onPress={() => printDatabaseContents()}
          style={{padding: 16, marginVertical: 8}}>
          <Text style={{color: '#dddddd', textAlign: 'center'}}>
            Log database contents to console
          </Text>
        </Button>
        <Button
          onPress={() => insert({personName: 'Kirsten', dogName: 'Sam'})}
          style={{padding: 16, marginVertical: 8}}>
          <Text style={{color: '#dddddd', textAlign: 'center'}}>
            Insert a person and dog for that person
          </Text>
        </Button>
        <Button
          onPress={() => failToInsert({personName: 'Kirsten', dogName: 'Sam'})}
          style={{padding: 16, marginVertical: 8}}>
          <Text style={{color: 'red', textAlign: 'center'}}>
            Cause an error while in a SQL transaction
          </Text>
        </Button>
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: '#cccccc'}}>
          React Native Quick SQLite example app
        </Text>
      </View>
    </SafeAreaView>
  );
}

type ButtonProps = {
  children: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};
function Button({children, onPress, style = {}}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        {backgroundColor: pressed ? '#444444' : '#333333'},
        style,
      ]}>
      {children}
    </Pressable>
  );
}

export default App;
