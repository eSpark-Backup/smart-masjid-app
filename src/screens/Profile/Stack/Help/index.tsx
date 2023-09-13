import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  ScrollView,
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
    if (text.length == 0) {
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
