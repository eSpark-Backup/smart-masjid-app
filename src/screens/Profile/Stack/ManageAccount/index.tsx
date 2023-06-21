import { useHookstate } from '@hookstate/core';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import phone from 'phone';

import {
  LogoutUser,
  SendOTP,
  UpdateUser,
  ValidateOTP,
} from '../../../../api/userController';
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
import { CountryCodes } from '../../../../types';
import { OtpForm } from '../../../../forms';

export default function ManageAccount({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [country, setCountry] = useState<CountryCodes>();
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
  const [showVerification, setShowVerification] = useState(false);
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

    const isValidPhone = await isValidPhoneNumber(data.phone, country);
    if (!isValidPhone) {
      return;
    }
    console.log('kia bhej raha hu me??', data);
    await UpdateUser({
      id: userData?.id?.toString()!,
      data: { ...data, phone: data.phone ? `${data.phone}` : '' },
    });

    onEditPress('');
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <OverlayLoader isShow={loading} />
      {!showVerification ? (
        <>
          <GapView length={20} />
          <TextLabel
            label="Manage Account"
            textStyle={{ alignSelf: 'center' }}
          />
          <GapView length={55} />
          <MyText text="Tap to edit" textStyle={{ alignSelf: 'center' }} />
          <GapView />
          {displayData.map((val, ind) => {
            if (!val.editable) {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onEditPress(val.key)}
                  key={ind}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: WINDOW_WIDTH - 60,
                    alignSelf: 'center',
                    paddingVertical: 10,
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    {val.icon}
                    <GapView mode="horizontal" />
                    <MyText text={val.title} textStyle={{ fontSize: 16 }} />
                  </View>
                  <View>
                    <MyText
                      text={data[val?.key] ?? 'Tap to add'}
                      textStyle={{ fontSize: 14, color: '#6E6E6E' }}
                    />
                  </View>
                </TouchableOpacity>
              );
            } else {
              return (
                <View
                  key={ind}
                  style={{
                    width: WINDOW_WIDTH - 60,
                    alignSelf: 'center',
                  }}>
                  <Card backgroundColor="#ffffff">
                    {val.key != 'phone' ? (
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                        phoneCodeValue={userData?.phone}
                        onPhoneCodeChange={country => {
                          setCountry(country);
                          console.log('what is selected code??', country?.code);
                          if (!userData?.phone?.includes(country.code)) {
                            setData({ ...data, [val?.key]: '' });
                          }
                        }}
                        onChangeText={(value: string) => {
                          console.log('what is the value', {
                            [val.key]: country?.code + value,
                          });
                          setData({
                            ...data,
                            [val.key]: country?.code + value,
                          });
                        }}
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
              <Rounded
                onPress={async () => {
                  if (
                    ['email', 'phone'].includes(
                      displayData.find(val => val.editable)?.key ?? '',
                    )
                  ) {
                    setLoading(true);
                    const email = data['email'];
                    const phoneNo = data['phone'];
                    const activeKey = displayData.find(
                      val => val.editable,
                    )?.key;
                    if (activeKey == 'phone') {
                      const isValidPhone = await isValidPhoneNumber(
                        phoneNo,
                        country,
                      );
                      if (!isValidPhone) {
                        setLoading(false);
                        return;
                      }
                      if (Boolean(phoneNo) == false) {
                        Toast.show({
                          text2: 'Phone number is not valid',
                          type: 'error',
                          visibilityTime: 10000,
                        });
                        setLoading(false);
                        return;
                      }
                    }
                    const result = await SendOTP(
                      activeKey == 'email' ? email : '',
                      activeKey == 'phone' ? phoneNo : '',
                    );
                    setShowVerification(true);
                    setLoading(false);
                  } else {
                    onSave();
                  }
                }}
                label="Save"
              />
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
        </>
      ) : (
        <>
          <OtpForm
            title="Verification"
            setStep={async (value: string) => {
              setLoading(true);
              const activeKey = displayData.find(val => val.editable)?.key;
              const isVerified = await ValidateOTP(
                value,
                activeKey == 'email' ? data.email : '',
                activeKey == 'phone' ? data.phone : '',
              );
              console.log('isVerified', isVerified);
              if (isVerified) {
                onSave();
                setShowVerification(false);
              }
              setLoading(false);
            }}
            onResend={async () => {
              const activeKey = displayData.find(val => val.editable)?.key;
              await SendOTP(
                activeKey == 'email' ? data.email : '',
                activeKey == 'phone' ? data.phone : '',
              );
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
