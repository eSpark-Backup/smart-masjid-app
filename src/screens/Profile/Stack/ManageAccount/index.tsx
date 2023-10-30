import { useHookstate } from '@hookstate/core';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Theme, useNavigation, useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  DeleteUser,
  LogoutUser,
  UpdateUser,
} from '../../../../api/userController';
import { Email, Phone, ProfileUser } from '../../../../assets';
import {
  GapView,
  LogoutModal,
  MyInput,
  MyText,
  MyTitle,
  OverlayLoader,
  Rounded,
  TestInput,
  TextLabel,
} from '../../../../components';
import { userStore } from '../../../../store/UserStore';
import { isValidPhoneNumber } from '../../../../utils/functions';
import { WINDOW_WIDTH } from '../../../../constants';
import { Card } from '../../../../containers';
import { BottomNavigationParamList, CountryCodes } from '../../../../types';
import { OtpForm } from '../../ProfileForms';
import { SendOTP, ValidateOTP } from '../../../../api/externalControllers';
import { deviceStore } from '../../../../store/DeviceStore';

type HomeNavigationProps = NativeStackScreenProps<
  BottomNavigationParamList,
  'Home'
>;

export default function ManageAccount({
  setFlag,
  showVerification = false,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  showVerification?: boolean;
  contentOpacity?: any;
}) {
  const navigation = useNavigation<HomeNavigationProps['navigation']>();
  const { colors }: Theme = useTheme();

  const [isVisible, setIsVisible] = useState(false);
  const [isDVisible, setIsDVisible] = useState(false);
  const [country, setCountry] = useState<CountryCodes>();
  const userObj = useHookstate(userStore.userData);
  const devices: any = useHookstate(deviceStore?.devices)?.get();
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

  const clearSelection = () => {
    const newData = displayData.map(data => {
      return {
        ...data,
        editable: false,
      };
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
    const oldData: any = userData;
    const gotUpdated =
      data[displayData.find(val => val.editable)?.key!] !=
      oldData[displayData.find(val => val.editable)?.key!];

    const dataToUpdate = {
      [displayData.find(val => val.editable)?.key!]:
        data[displayData.find(val => val.editable)?.key!],
    };
    console.log('kia bhej raha hu me??', dataToUpdate);
    if (gotUpdated) {
      await UpdateUser(userData?.id?.toString()!, dataToUpdate);
    }
    onEditPress('');
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={clearSelection}>
      <View style={{ flex: 1 }}>
        <OverlayLoader isShow={loading} />
        {!showVerification ? (
          <>
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
                <MyTitle text="Manage Account" />
              </Animated.View>
            </View>
            <View>
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
                          textStyle={{
                            fontSize: 14,
                            color: '#6E6E6E',
                            width: WINDOW_WIDTH * 0.55,
                            textAlign: 'right',
                          }}
                          lines={1}
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
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <GapView mode="horizontal" />
                            {val.icon}
                            <GapView mode="horizontal" />
                            <MyInput
                              onBlur={() => console.log('clear Selection krdo')}
                              onFocus={() => console.log('Focused')}
                              maxLength={
                                val.key == 'firstName' || val.key == 'lastName'
                                  ? 25
                                  : undefined
                              }
                              isMAccont
                              placeholderColor="#CFCFCF"
                              placeholder={val.title}
                              onChangeText={(value: string) =>
                                setData({ ...data, [val.key]: value })
                              }
                              value={data[val.key]}
                            />
                          </View>
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <GapView mode="horizontal" />
                            {val.icon}
                            <GapView mode="horizontal" />
                            <MyInput
                              maxLength={10}
                              placeholder="Phone"
                              isMAccont
                              isPhoneCode
                              placeholderColor="#CFCFCF"
                              phoneCodeValue={userData?.phone}
                              onPhoneCodeChange={country => {
                                setCountry(country);
                                console.log(
                                  'what is selected code??',
                                  country?.code,
                                );
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
                          </View>
                        )}
                      </Card>
                    </View>
                  );
                }
              })}
            </View>
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
                      setFlag('mAccOtp');
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
                    onPress={() => setIsVisible(true)}
                    // onPress={() => crashlytics().crash()}
                  >
                    <TextLabel
                      label="Logout"
                      textStyle={{ color: '#ffffff' }}
                    />
                  </TouchableOpacity>
                  <GapView length={20} />
                  <TouchableOpacity onPress={() => setIsDVisible(true)}>
                    <MyText
                      size={18}
                      text={'Delete Account'}
                      textStyle={{ color: '#FF6464', textAlign: 'center' }}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
            <LogoutModal
              message="Do you wish to logout?"
              visible={isVisible}
              onAllowed={async () => {
                setLoading(true);
                setIsVisible(!isVisible);
                await LogoutUser(userData?.id?.toString() ?? '');
                setLoading(false);
                console.log('Logged Out');
              }}
              onClose={() => {
                setIsVisible(!isVisible);
                console.log('Cancelled');
              }}
            />
            <LogoutModal
              message="Once you delete your account it cannot be undone, do you wish to proceed?"
              visible={isDVisible}
              title1={'No'}
              title2={'Yes'}
              onAllowed={async () => {
                console.log('userData', userData);
                if (devices?.length > 0) {
                  navigation.navigate('Device');
                  Toast.show({
                    text1: 'Warning!',
                    text2: 'Delete your devices before account deletion!',
                    type: 'warning',
                  });
                  setIsDVisible(false);
                } else {
                  await DeleteUser(userData?.id?.toString() ?? '');
                  setIsDVisible(false);
                }
              }}
              onClose={() => {
                setIsDVisible(false);
                console.log('Cancelled');
              }}
            />
          </>
        ) : (
          <>
            <OtpForm
              title="Verification"
              userEmail={data.email}
              userPhone={data.phone}
              goBack={() => {
                setFlag('mAcc');
                clearSelection();
              }}
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
                  clearSelection();
                  onSave();
                  setFlag('mAcc');
                } else {
                  setLoading(false);
                }
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({});
