import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

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
          paddingBottom: 112,
        }}>
        <View style={{ flex: 1 }}>
          <Card
            backgroundColor="#ffffff"
            height={45}
            width={WINDOW_WIDTH - 30}
            style={{ elevation: 3 }}>
            <MyInput
              helpSearch
              inputStyle={{ width: WINDOW_WIDTH - 30 }}
              placeholder="Search"
              // onSearch={onSearch}
              // value={value}
            />
          </Card>
          <GapView />
          <FlatList
            data={[1, 2, 3, 4]}
            renderItem={() => <Accordian />}
            ItemSeparatorComponent={() => <GapView />}
          />
        </View>
        <View
          style={{
            marginTop: 45,
            alignItems: 'center',
          }}>
          <MyText size={16} text={`Can't find what your looking for?`} />
          <GapView />
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => setFlag('cUs')}>
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
