import { useHookstate } from '@hookstate/core';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LogoutUser } from '../../../../api/userController';

import {
  EditVector,
  Email,
  Phone,
  Power,
  ProfileUser,
} from '../../../../assets';
import {
  GapView,
  LogoutModal,
  MyDivider,
  ProfileAvatar,
  ProfileSectionlist,
  TextLabel,
} from '../../../../components';
import { userStore } from '../../../../store/UserStore';
import { removeDatafromLocalStorage } from '../../../../utils/functions';

export default function ManageAccount({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const userObj = useHookstate(userStore.userData);
  const userData = userObj?.get();
  return (
    <View style={{ flex: 1 }}>
      <GapView length={20} />
      <TextLabel label="Manage Account" textStyle={{ alignSelf: 'center' }} />
      <GapView length={45} />
      <ProfileSectionlist
        scroll={false}
        data={[
          {
            title: 'Manage Account',
            icon: <EditVector />,
            onIconPress: () => setFlag('modAcc'),
            data: [
              {
                title: 'Name',
                value: userData?.firstName + ' ' + userData?.lastName,
                icon: <ProfileUser />,
                onPress: () => console.log('no effect'),
              },
              {
                title: 'Email',
                value: userData?.email ?? '-',
                icon: <Email />,
                onPress: () => console.log('no effect'),
              },
              {
                title: 'Phone',
                value: userData?.phone ?? '-',
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
        message="Do you wish to logout?"
        visible={isVisible}
        onAllowed={async () => {
          await LogoutUser(userData?.id?.toString() ?? '');
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
