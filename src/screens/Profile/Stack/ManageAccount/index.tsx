import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import {
  Email,
  Phone,
  Power,
  ProfileUser,
  SettingsVector,
} from '../../../../assets';
import {
  GapView,
  LogoutModal,
  MyDivider,
  ProfileAvatar,
  ProfileSectionlist,
  TextLabel,
} from '../../../../components';

export default function ManageAccount({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

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
        scroll={false}
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
      <View style={{ marginHorizontal: 15, marginBottom: 30 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            height: 41,
            width: '100%',
            backgroundColor: '#FF6464',
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
          onPress={() => setIsVisible(true)}>
          <Power style={{ right: 15 }} />
          <TextLabel label="Logout" textStyle={{ color: '#ffffff' }} />
        </TouchableOpacity>
      </View>
      <LogoutModal
        visible={isVisible}
        onAllowed={() => {
          setIsVisible(!isVisible);
          console.log('Logged Out');
        }}
        onClose={() => {
          setIsVisible(!isVisible);
          console.log('Cancelled');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
