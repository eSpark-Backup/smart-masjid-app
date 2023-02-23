import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { DeviceSvg, PlusSvg } from '../../assets';
import { GapView, MyText, TextLabel } from '../../components';
import DeviceCard from '../../components/DeviceCard';
import DeviceSettingSectionList from '../../components/DeviceSettingSectionList';
import { Card, Wrapper } from '../../containers';
import { BottomNavigationParamList } from '../../types';

type DeviceNavigationProps = NativeStackScreenProps<
  BottomNavigationParamList,
  'Home'
>;

const AddDevice = () => {
  return (
    <Card>
      <View style={styles.AddDeviceContainer}>
        <View>
          <TextLabel label="Dont see your device?" />
          <GapView length={5} />
          <MyText text="Lets connect" />
        </View>
        <View>
          <PlusSvg />
        </View>
      </View>
    </Card>
  );
};
export default function Device() {
  return (
    <Wrapper showFooter={false}>
      {/* <FlatList
        contentContainerStyle={{padding: 10}}
        data={Array(3).fill(10)}
        renderItem={() => <DeviceCard />}
        ItemSeparatorComponent={GapView}
        ListFooterComponent={
          <>
            <GapView />
            <AddDevice />
          </>
        }
      /> */}
      <DeviceSettingSectionList
        data={[
          {
            title: 'General Settings',
            data: [
              { title: 'Nick Name', subtitle: 'Home Device', icon: <DeviceSvg />, isEditable: true },
              { title: 'Nick Name', subtitle: 'Home Device', icon: <DeviceSvg /> },
            ],
          },
        ]}
      />
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  AddDeviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
  },
});
