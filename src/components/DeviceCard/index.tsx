import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { DeviceSvg, PlusSvg, ThreeDotSvg } from '../../assets';
import { Card } from '../../containers';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

export default function DeviceCard({
  onPress = () => {},
}: {
  onPress?: () => void;
}) {
  return (
    <View style={{marginHorizontal:  10}}>
      <Card height={161} width={165}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.9}
          style={styles.container}>
          <View style={{ alignItems: 'center', width: '100%' }}>
            <GapView mode="horizontal" length={15} />
            <View>
              <TextLabel
                label="My Home Speaker"
                textStyle={{ alignItems: 'center', fontSize: 14 }}
              />
              <GapView length={25} />
              <DeviceSvg height={50} width={50} style={{alignSelf: 'center',}} />
              <GapView length={25} />
              <View style={styles.row}>
                <View style={styles.activeStatus} />
                <GapView mode="horizontal" length={5} />
                <MyText text="Online" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  status: {
    height: 8,
    width: 8,
    borderWidth: 0.7,
    borderRadius: 10,
  },
  activeStatus: {
    height: 8,
    width: 8,
    borderWidth: 0.7,
    borderRadius: 10,
    backgroundColor: '#1DF126',
  },
});
