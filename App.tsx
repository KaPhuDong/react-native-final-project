// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import HelloWorld from './src/components/demobuoi1/HelloWorld';
// import Baitap3 from './src/components/demobuoi1/Baitap3';
// import Baitap1 from './src/components/buoi3/Baitap1';
// import vidu2_props from './src/components/demobuoi1/vidu2_props';
// import LinearSolver from './src/components/demobuoi1/vidu2_props';
// import Homework from './src/components/buoi4/Homework';
// import BMIApp from './src/components/buoi5/BMIApp';
// import Layout from './src/components/buoi6/Layout';
// import BMICalculator from './src/components/buoi7/BMICalculator';
// import ProductCard2 from './src/components/buoi8/ProductCard2';
// import StudentList from './src/components/buoi9/StudentList';
// import ContactApp from './src/components/buoi10Test/ContactApp';
// import Sanpham3Sqlite from './src/components/buoi11Sqlite/Sanpham3Sqlite';
// import AppNavigatorProduct from './src/components/buoi11Sqlite/AppNavigatorProduct';
// import HomeScreen from './src/components/buoi11Sqlite/HomeScreen';
// import DetailsScreen from './src/components/buoi11Sqlite/DetailsScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function App(): JSX.Element {
//   const Stack = createNativeStackNavigator();
//   return (
//     // <HelloWorld />
//     // <Baitap3 />
//     // <Baitap1 />
//     // <LinearSolver/>
//     // <Homework/>
//     // <BMIApp />
//     // <Layout/>
//     // <BMICalculator/>
//     // <ProductCard2/>
//     // <StudentList/>
//     // <ContactApp />
//     // < Sanpham3Sqlite/>

//     <NavigationContainer>
//       {/* <AppNavigatorProduct/> */}

//       <Stack.Navigator
//         screenOptions={{headerShown: false}}
//         initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Details" component={DetailsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppTabs from './src/components/buoi11Sqlite/AppTabs';
import {initDatabase} from './src/components/buoi11Sqlite/database';

function App() {
  useEffect(() => {
    initDatabase(() => {
      console.log('🔥 SQLite READY');
    });
  }, []);

  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}

export default App;
