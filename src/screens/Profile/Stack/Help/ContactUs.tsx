import { useHookstate } from '@hookstate/core';
import { Theme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { ContactUs } from '../../../../assets';

import {
  Accordian,
  GapView,
  MyDropDown,
  MyInput,
  MyText,
  MyTitle,
  Rounded,
} from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { Card } from '../../../../containers';
import { helpStore } from '../../../../store/HelpStore';

export default function ContactUsScreen({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const { colors }: Theme = useTheme();
  const reasons: any = useHookstate(helpStore.reasons).get();
  const [description, setDescription] = useState('');

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Contact Us" style={{ alignSelf: 'center' }} />
        </Animated.View>
        <GapView length={55} />
      </View>

      <View
        style={{
          top: 112,
          alignItems: 'center',
          paddingBottom: 112,
        }}>
        <MyDropDown
          title={''}
          searchDisabled
          placeholder="Reason"
          items={reasons ?? []}
          width={WINDOW_WIDTH - 50}
          containerPadding={0}
        />
        <GapView length={20} />
        <MyInput
          placeholder="Description"
          multiline
          numberOfLines={4}
          value={description}
          inputStyle={{
            width: WINDOW_WIDTH - 50,
            textAlignVertical: 'top',
          }}
          onChangeText={setDescription}
        />
        <GapView length={20} />
        <Rounded label="Submit" />
        <GapView length={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
