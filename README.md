# QuickSqliteAsyncExample

This is a minimal reproduction of issues using Promise-based transaction functions with
[react-native-quick-sqlite](https://github.com/ospfranco/react-native-quick-sqlite). This has only
been built for iOS and doesn't concern itself with Android.

## How to run

This project uses yarn and requires explicitly calling `pod install`:

1. Clone the repo and `cd` into the directory,
1. `npm install`,
1. `cd ios && bundle install && bundle exec pod install; cd ..`, and
1. `yarn ios`.

This should open the app in the an iOS simulator.

## How to reproduce the issue

After the app is running

1. Click `Migrate database up`,
1. Click `Insert a person and dog for that person`, and
1. Click `Cause an error while in a SQL transaction`.

At any point, click `Log database contents to console` for a simple dump of the `people` records
joined with their `dog` records.

After clicking `Cause an error while in a SQL transaction`, you should see a Red [SQL execution
error](./sql-execution-error.png)
