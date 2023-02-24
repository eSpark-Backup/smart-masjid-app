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
    <>
      <Card>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.9}
          style={styles.container}>
          <View style={styles.row}>
            <View>
              <DeviceSvg />
            </View>
            <GapView mode="horizontal" length={15} />
            <View>
              <TextLabel label="Home" />
              <View style={styles.row}>
                <View style={styles.status} />
                <GapView mode="horizontal" length={5} />
                <MyText text="Online" />
              </View>
            </View>
          </View>
          <View>
            <ThreeDotSvg />
          </View>
        </TouchableOpacity>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
