import { useHookstate } from '@hookstate/core';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LogoutUser, UpdateUser } from '../../../../api/userController';

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
  MyInput,
  MyText,
  OverlayLoader,
  ProfileAvatar,
  ProfileSectionlist,
  Rounded,
  TextLabel,
} from '../../../../components';
import { userStore } from '../../../../store/UserStore';
import {
  isValidPhoneNumber,
  removeDatafromLocalStorage,
} from '../../../../utils/functions';
import { WINDOW_WIDTH } from '../../../../constants';
import { Card } from '../../../../containers';
import Toast from 'react-native-toast-message';

export default function ManageAccount({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const userObj = useHookstate(userStore.userData);
  const userData = userObj?.get();
  const [data, setData] = useState<any>({
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
    phone: userData?.phone,
  });
  const [loading, setLoading] = useState(false);
  const [displayData, setDisplayingData] = useState([
    {
      title: 'First Name',
      icon: <ProfileUser />,
      key: 'firstName',
      editable: false,
    },
    {
      title: 'Last Name',
      icon: <ProfileUser />,
      key: 'lastName',
      editable: false,
    },
    {
      title: 'Email',
      icon: <Email />,
      key: 'email',
      editable: false,
    },
    {
      title: 'Phone',
      icon: <Phone />,
      key: 'phone',
      editable: false,
    },
  ]);

  const onEditPress = (key: string) => {
    const newData = displayData.map(data => {
      if (data.key == key) {
        return {
          ...data,
          editable: true,
        };
      } else {
        return {
          ...data,
          editable: false,
        };
      }
    });
    setData({
      ...{
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
        phone: userData?.phone,
      },
    });
    setDisplayingData([...newData]);
  };

  const onSave = async () => {
    setLoading(true);
    if (data.phone) {
      const isValid = isValidPhoneNumber(data.phone?.replace('+1',''));
      if (!isValid) {
        Toast.show({
          text2: 'Phone number is not valid',
          type: 'error',
        });
        setLoading(false);
        return;
      }
    }
    await UpdateUser(userData?.id?.toString() || '', {
      ...data,
      phone: `${data.phone}`,
    });
    onEditPress('');
    setLoading(false);
  };
  return (
    <View style={{ flex: 1 }}>
      <OverlayLoader isShow={loading} />
      <GapView length={20} />
      <TextLabel label="Manage Account" textStyle={{ alignSelf: 'center' }} />
      <GapView length={55} />
      <MyText text="Tap to edit" textStyle={{ alignSelf: 'center' }} />
      <GapView />
      {displayData.map((val, ind) => {
        if (!val.editable) {
          return (
            <View
              key={ind}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: WINDOW_WIDTH - 60,
                alignSelf: 'center',
                paddingVertical: 15,
              }}>
              <View style={{ flexDirection: 'row' }}>
                {val.icon}
                <GapView mode="horizontal" />
                <MyText text={val.title} textStyle={{ fontSize: 16 }} />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onEditPress(val.key)}>
                <MyText
                  text={data[val?.key] ?? '-'}
                  textStyle={{ fontSize: 14, color: '#6E6E6E' }}
                />
              </TouchableOpacity>
            </View>
          );
        } else {
          return (
            <View
              key={ind}
              style={{
                width: WINDOW_WIDTH - 60,
                alignSelf: 'center',
              }}>
              <Card>
                {val.key != 'phone' ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <GapView mode="horizontal" />
                    {val.icon}
                    <GapView mode="horizontal" />
                    <MyInput
                      placeholderColor="#CFCFCF"
                      onChangeText={(value: string) =>
                        setData({ ...data, [val.key]: value })
                      }
                      value={data[val.key]}
                    />
                  </View>
                ) : (
                  <MyInput
                    isPhoneCode
                    placeholderColor="#CFCFCF"
                    onChangeText={(value: string) =>
                      setData({ ...data, [val.key]: value })
                    }
                    value={data[val.key]}
                  />
                )}
              </Card>
            </View>
          );
        }
      })}
      <View
        style={{
          marginHorizontal: 15,
          marginBottom: 30,
          bottom: 0,
          position: 'absolute',
          width: 250,
          alignSelf: 'center',
        }}>
        {displayData.some(val => val.editable) ? (
          <Rounded onPress={onSave} label="Save" />
        ) : (
          <>
            <GapView />
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
          </>
        )}
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
