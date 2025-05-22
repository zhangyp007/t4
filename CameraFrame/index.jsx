import React from 'react';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  useCodeScanner,
} from 'react-native-vision-camera';
import {View, Text, StyleSheet} from 'react-native';
import {useMount} from 'ahooks';

export default () => {
  const devices = useCameraDevices();

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    // const objects = detectObjects(frame)
    // const label = objects[0].name
    // console.log(`You're looking at a ${label}.`)
    // console.log(frame);
    console.log(Math.random());
  }, []);
  const device = devices?.[0];
  if (!device) {
    return (
      <>
        <Text>!device</Text>
      </>
    );
  }
  return (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={devices[1]}
        isActive={true}
        frameProcessorFps={10}
        frameProcessor={frameProcessor}
      />
    </>
  );
};
