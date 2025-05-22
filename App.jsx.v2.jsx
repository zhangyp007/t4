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

import {runOnUI, runOnJS} from 'react-native-worklets-core';

import CheckSDCardPowers from './CheckSDCardPowers';
import CheckPagePowers from './CheckPagePowers';

export default () => {
  const onWorklet = () => {
    'worklet';
    console.log('[Worklet] 运行在 UI 线程');

    // 调用 JS 的函数
    runOnJS(setMessage)('来自 UI 线程的回调');
  };

  const triggerWorklet = () => {
    runOnUI(onWorklet)();
  };

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
                    triggerWorklet();
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
