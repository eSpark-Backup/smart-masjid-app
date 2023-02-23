import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Email, Phone, ProfileUser, SettingsVector } from '../../../../assets';
import {
  GapView,
  MyDivider,
  ProfileAvatar,
  ProfileSectionlist,
} from '../../../../components';

export default function ManageAccount({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <ProfileAvatar />
      <MyDivider
        style={{ alignSelf: 'center', top: 22 }}
        height={0.5}
        backgroundColor={'#9E9F9F'}
      />
      <GapView length={20} />
      <ProfileSectionlist
        data={[
          {
            title: 'Manage Account',
            icon: <SettingsVector />,
            onIconPress: () => setFlag('modAcc'),
            data: [
              {
                title: 'Name',
                icon: <ProfileUser />,
                onPress: () => console.log('no effect'),
              },
              {
                title: 'Email',
                icon: <Email />,
                onPress: () => console.log('no effect'),
              },
              {
                title: 'Phone',
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

const styles = StyleSheet.create({});
