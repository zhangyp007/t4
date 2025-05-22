import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  AppState,
} from 'react-native';

import {useMount, useSafeState} from 'ahooks';
import {
  checkMultiple,
  PERMISSIONS,
  RESULTS,
  openSettings,
  request,
} from 'react-native-permissions';

import dayjs from 'dayjs';

const CkPowerWaitMs = 1000;

const styles = StyleSheet.create({
  pageTitle: {
    margin: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
});

let clickPowers = [];
const apiLevel = Platform.Version;
if (apiLevel >= 33) {
  clickPowers = ['READ_MEDIA_IMAGES', 'READ_MEDIA_VIDEO', 'READ_MEDIA_AUDIO'];
} else if (apiLevel >= 30) {
  clickPowers = ['MANAGE_EXTERNAL_STORAGE'];
} else {
  // clickPowers = ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'];
  clickPowers = ['READ_EXTERNAL_STORAGE'];
}

export default ({children, ...otherProps}) => {
  // useMount(() => {
  //   console.log('clickPowers', clickPowers);
  // });

  const [allowPowers, setAllowPowers] = useSafeState([]);
  const [group, setGropu] = useSafeState([]);
  const [unavailablePowers, setUnavailablePowers] = useSafeState([]);

  const setInfo = async () => {
    const newMap = new Map();
    for (const name of new Set(clickPowers)) {
      const key = PERMISSIONS.ANDROID[name] || name;
      newMap.set(key, {name: name});
    }
    const powerList = [...newMap].map(([key]) => key);
    // console.log('powerList', powerList);
    try {
      const statuses = await checkMultiple(powerList);
      console.log('statuses', statuses);
      for (const [key, powerStr] of Object.entries(statuses)) {
        const oldData = newMap.get(key);
        newMap.set(key, {...oldData, powerStr});
      }
      const getPowersArr = targetValue => {
        const items = [];
        [...newMap].forEach(([, item]) => {
          if (item.powerStr === targetValue) {
            items.push(item);
          }
        });
        return items;
      };
      const allows = getPowersArr(RESULTS.GRANTED);
      // console.log('allows', allows);
      setAllowPowers([...allows]);
      const unavailables = getPowersArr(RESULTS.UNAVAILABLE);
      setUnavailablePowers(unavailables);
      // console.log('unavailables', unavailables);
      const gArr = [
        // RESULTS.GRANTED,
        RESULTS.LIMITED,
        RESULTS.DENIED,
        RESULTS.BLOCKED,
        // RESULTS.UNAVAILABLE,
      ];
      // console.log('gArr', gArr);
      const rtArr = [];
      gArr.forEach(targetValue => {
        rtArr.push(getPowersArr(targetValue));
      });
      setGropu(rtArr);
      // console.log('rtArr', rtArr);
    } catch (e) {
      console.log('获取权限异常', e.message);
    }
  };

  useMount(() => {
    setInfo();
  });
  const stateChange = v => {
    console.log('App状态', v);
    if (v === 'active') {
      setInfo();
    }
  };
  useMount(() => {
    AppState.addEventListener('change', stateChange);
  });

  if (allowPowers.length !== clickPowers.length) {
    return (
      <>
        <ScrollView>
          <View style={styles.pageTitle}>
            <Text>需要授于权限</Text>
          </View>
          <View style={styles.listItem}>
            <Text>Android API Version</Text>
            <Text>{Platform.Version}</Text>
          </View>
          <View>
            {[...allowPowers].map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text>{item.name}</Text>
                <Text>OK</Text>
              </View>
            ))}
          </View>
          {group.map((gRows, gIndex) => (
            <View key={gIndex}>
              {[...gRows].map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Text>{item.name}</Text>
                  <View>
                    <TouchableOpacity
                      onPress={async () => {
                        if (
                          [RESULTS.UNAVAILABLE, RESULTS.GRANTED].includes(
                            item.powerStr,
                          )
                        ) {
                          return;
                        }
                        let v = '';
                        let t1 = dayjs();
                        let t2;
                        try {
                          console.log(
                            item.name,
                            PERMISSIONS.ANDROID[item.name],
                          );
                          console.log(PERMISSIONS.ANDROID);
                          v = await request(PERMISSIONS.ANDROID[item.name]);
                          t2 = dayjs();
                        } catch (e) {
                          Alert.alert('操作失败', e.message);
                          console.log('item.name', item.name);
                          return;
                        }
                        console.log('到这了', v, RESULTS.GRANTED);
                        let useMs = t2.diff(t1, 'ms');
                        console.log(
                          'useMs',
                          useMs,
                          'CkPowerWaitMs',
                          CkPowerWaitMs,
                        );
                        if (useMs < CkPowerWaitMs && v !== RESULTS.GRANTED) {
                          // setModalVisible(false);
                          openSettings().catch(() =>
                            Alert.alert('操作失败', '打开系统设置'),
                          );
                        } else {
                          setInfo();
                        }
                      }}>
                      <Text>点击授权</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}
          <View>
            {[...unavailablePowers].map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text>{item.name}</Text>
                <Text>NotFound</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </>
    );
  }

  return React.cloneElement(children, {...otherProps});
};
