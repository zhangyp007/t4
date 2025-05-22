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

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

import {useWorklet} from 'react-native-worklets-core';

import CheckSDCardPowers from './CheckSDCardPowers';
import CheckPagePowers from './CheckPagePowers';

export default () => {
  const dummyWorklet = useWorklet('default', name => {
    'worklet';
    console.log(`useWorklet(${name}) called!`);
  });
  return (
    <>
      <SafeAreaView>
        <CheckSDCardPowers>
          <CheckPagePowers clickPowers={['CAMERA']}>
            <View>
              <View>
                <Text>OK2</Text>
              </View>
              <View>
                <Button
                  title="按钮"
                  onPress={() => {
                    dummyWorklet('abc');
                  }}
                />
              </View>
            </View>
          </CheckPagePowers>
        </CheckSDCardPowers>
      </SafeAreaView>
    </>
  );
};
