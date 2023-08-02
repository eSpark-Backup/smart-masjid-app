import React, { useState } from 'react';
import { View, Animated } from 'react-native';
import { Email, Phone, ProfileUser } from '../../../../assets';
import {
  GapView,
  MyText,
  ProfileSectionlist,
  TextLabel,
} from '../../../../components';
import { UserResponse } from '../../../../types/userControllerApiResponse';

export default function ViewUsers({
  setFlag,
  user = null,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  user?: UserResponse | null | undefined;
  contentOpacity?: any;
}) {
  return (
    <View style={{ flex: 1, marginTop: 0 }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label="User Information"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{top: 100}}>
        <ProfileSectionlist
          scroll={false}
          data={[
            {
              title: 'User Information',
              onIconPress: () => setFlag('modAcc'),
              data: [
                {
                  title: 'Full Name',
                  value: user?.firstName + ' ' + user?.lastName,
                  icon: <ProfileUser />,
                  onPress: () => console.log('no effect'),
                },
                {
                  title: 'Email',
                  value: user?.email ?? '-',
                  icon: <Email />,
                  onPress: () => console.log('no effect'),
                },
                {
                  title: 'Phone',
                  value: user?.phone ?? '-',
                  icon: <Phone />,
                  onPress: () => console.log('no effect'),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}
