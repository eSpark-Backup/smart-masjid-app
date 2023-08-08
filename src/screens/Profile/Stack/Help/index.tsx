import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';

import { ContactUs } from '../../../../assets';

import {
  Accordian,
  GapView,
  MyInput,
  MyText,
  MyTitle,
} from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { Card } from '../../../../containers';

export default function HelpScreen({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const { colors }: Theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Help" style={{ alignSelf: 'center' }} />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View
        style={{
          top: 112,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Card
            backgroundColor="#ffffff"
            height={45}
            width={WINDOW_WIDTH - 30}
            style={{ elevation: 3 }}>
            <MyInput
              helpSearch
              // onFocus={() => {
              //   if (zipCode == 'Your Location') {
              //     setZipCode('');
              //   }
              // }}
              // onCurrentLocationPress={onCurrentLocationPress}
              inputStyle={{ width: WINDOW_WIDTH - 30 }}
              placeholder="Search"
              // onSearch={onSearch}
              // value={zipCode}
            />
          </Card>
          <GapView />
          <View>
            <Accordian />
            <Accordian />
            <Accordian />
            <Accordian />
          </View>
        </View>
        <View
          style={{
            bottom: 112,
            alignItems: 'center',
          }}>
          <MyText size={16} text={`Can't find what your looking for?`} />
          <GapView />
          <TouchableOpacity style={{ flexDirection: 'row' }}>
            <ContactUs />
            <MyText
              size={16}
              text={`Contact us`}
              textStyle={{ color: colors.primary }}
            />
          </TouchableOpacity>
          <GapView />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
