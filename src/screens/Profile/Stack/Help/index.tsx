import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import { useHookstate } from '@hookstate/core';
import { Theme, useTheme } from '@react-navigation/native';

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
import { helpStore } from '../../../../store/HelpStore';
import { FAQ } from '../../../../types';

export default function HelpScreen({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const { colors }: Theme = useTheme();
  const FAQData: any = useHookstate(helpStore.FAQs).get();
  const [FAQs, setFAQs] = useState<FAQ[]>([]);

  useEffect(() => {
    setFAQs(FAQData);
  }, []);

  const onSearch = (text: string) => {
    if (text?.length == 0) {
      setFAQs(FAQData);
      return;
    }
    const FQs = FAQData.filter(
      (item: FAQ) =>
        item.question.toLowerCase().includes(text.toLowerCase()) ||
        item.answer.toLowerCase().includes(text.toLowerCase()) ||
        item.category.toLowerCase().includes(text.toLowerCase()),
    );
    setFAQs(FQs);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Help" />
        </Animated.View>
      </View>
      <GapView />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{ flex: 1 }}>
          <Card width={WINDOW_WIDTH - 30}>
            <MyInput
              helpSearch
              inputStyle={{ width: WINDOW_WIDTH - 30 }}
              placeholder="Search"
              onChangeText={onSearch}
              // value={value}
            />
          </Card>
          <GapView />
          <FlatList
            data={FAQs}
            renderItem={({ item }) => (
              <Accordian question={item.question} answer={item.answer} />
            )}
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
            <ContactUs width={22} height={22} color={'#006870'} />
            <GapView length={5} mode="horizontal" />
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
