import { useHookstate } from '@hookstate/core';
import { Theme, useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { StyleSheet, View, Animated, Platform } from 'react-native';

import { CreateSupportRequest } from '../../../../api/helpController';

import { ContactUs } from '../../../../assets';

import {
  Accordian,
  GapView,
  MyDropDown,
  MyInput,
  MyText,
  MyTitle,
  OverlayLoader,
  Rounded,
} from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { Card } from '../../../../containers';
import { helpStore } from '../../../../store/HelpStore';
import { userStore } from '../../../../store/UserStore';
import { supportRequestData } from '../../../../types';

export default function ContactUsScreen({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const { colors }: Theme = useTheme();
  const reasons: any = useHookstate(helpStore.reasons).get();
  const userData: any = useHookstate(userStore.userData).get();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);

  const requestToSupport = async () => {
    setLoading(true);
    if (!userData?.id || selectedReasonId == null || description.length == 0) {
      Toast.show({
        type: 'error',
        text2: 'Please fill given fields',
      });
      setLoading(false);
      return;
    }
    const data: supportRequestData = {
      userId: userData?.id,
      reasonId: selectedReasonId!,
      problem: description,
    };
    await CreateSupportRequest(data);
    setDescription('');
    setSelectedReasonId(null);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
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
          <MyTitle text="Contact Us" />
        </Animated.View>
      </View>
      <GapView />
      <View
        style={{
          alignItems: 'center',
        }}>
        <OverlayLoader isShow={loading} />
        <MyDropDown
          title={''}
          searchDisabled
          placeholder="Reason"
          items={reasons ?? []}
          onChangeValue={e => setSelectedReasonId(e.id)}
          width={WINDOW_WIDTH - 30}
          containerPadding={0}
        />
        <GapView length={20} />
        <MyInput
          placeholder="Describe your problem here"
          multiline
          numberOfLines={4}
          value={description}
          inputStyle={{
            width: WINDOW_WIDTH - 30,
            textAlignVertical: 'top',
          }}
          onChangeText={setDescription}
        />
        <GapView length={20} />
        <Rounded onPress={requestToSupport} label="Submit" />
        <GapView length={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
