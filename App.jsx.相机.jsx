import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import CheckSDCardPowers from './CheckSDCardPowers';
import CheckPagePowers from './CheckPagePowers';
import CameraFrame from './CameraFrame';

const styles = StyleSheet.create({
  box: {
    flexGrow: 1,
  },
});
export default () => {
  return (
    <>
      <SafeAreaView style={styles.box}>
        <CheckSDCardPowers>
          <CheckPagePowers clickPowers={['CAMERA']}>
            <CameraFrame />
          </CheckPagePowers>
        </CheckSDCardPowers>
      </SafeAreaView>
    </>
  );
};
