import React, { useState } from 'react';
import { View } from 'react-native';
import { Email, Phone, ProfileUser } from '../../../../assets';
import { GapView, MyText, ProfileSectionlist, TextLabel } from '../../../../components';
import { UserResponse } from '../../../../types/userControllerApiResponse';

export default function ViewUsers({
  setFlag,
  user = null,
}: {
  setFlag: (value: string) => void;
  user?: UserResponse | null | undefined;
}) {
  return (
    <View style={{ flex: 1, marginTop: 0 }}>
      <GapView length={20} />
      <TextLabel label="User Information" textStyle={{ alignSelf: 'center' }} />
      <GapView length={50} />
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
  );
}
