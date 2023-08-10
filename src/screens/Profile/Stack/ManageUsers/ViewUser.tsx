import React, { useState } from 'react';
import { View, Animated } from 'react-native';
import { Email, PeoplesSvg, Phone, ProfileUser } from '../../../../assets';
import {
  GapView,
  MyText,
  MyTitle,
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
          <MyTitle text="User Information" />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 100 }}>
        <GapView />
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
                {
                  title: 'Role',
                  value: user?.userType.name ?? '-',
                  icon: <PeoplesSvg />,
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
