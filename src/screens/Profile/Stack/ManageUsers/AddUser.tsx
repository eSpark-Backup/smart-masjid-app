import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { View, Animated, Platform } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

import { api } from '../../../../api';
import { CheckUserExists } from '../../../../api/externalControllers';
import {
  AddAdminIntoMasjid,
  GetUser,
  GetUserTypes,
} from '../../../../api/userController';
import {
  GapView,
  MyDropDown,
  MyInput,
  MyText,
  MyTitle,
  OverlayLoader,
  Rounded,
} from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { AddAdminForSchema } from '../../../../constants/validations/schema';
import { Card } from '../../../../containers';
import {
  CreateUserRequest,
  UserResponse,
  UserType,
} from '../../../../types/userControllerApiResponse';
import { ImmutableObject, useHookstate } from '@hookstate/core';
import { userStore } from '../../../../store/UserStore';
import Toast from 'react-native-toast-message';

export default function AddUsers({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [roleError, setRoleError] = useState(false);
  const userData: ImmutableObject<ImmutableObject<UserResponse>> | null =
    useHookstate(userStore?.userData).get();
  const userRoles: ImmutableObject<ImmutableObject<UserType[]>> | null =
    useHookstate(userStore?.userRoles).get();

  useEffect(() => {
    if (roleId! > 0) setRoleError(false);
  }, [roleId]);

  const onSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    try {
      if (roleId! < 1) {
        setRoleError(true);
        return;
      }
      setLoading(true);
      // Check if user already exists
      const data: UserResponse = await GetUser(values.email);
      const obj: CreateUserRequest = {
        ...values,
        email: values.email?.toLowerCase(),
        userTypeId: roleId ?? undefined,
        masjidId: userData?.masjid?.id.toString(),
      };
      console.log('data kitna', data);

      console.log('data check', data.userType.name);

      setLoading(false);

      // If user already exists so direct add to masjid
      if (data && data.userType.name != 'Customer') {
        Toast.show({
          text2: 'User already exists with the given email',
          type: 'error',
        });
      } else if (data && data.userType.name == 'Customer') {
        const res = await AddAdminIntoMasjid(
          data?.id?.toString(),
          userData?.masjid?.id.toString()!,
          roleId ?? 0,
        );
        setLoading(false);
        if (res) setFlag('mUsers');
      } else {
        // Else Create User with current masjid
        const createUserResp: any = await api.post('/users', obj);
        console.log('createUserResp', createUserResp);

        if (createUserResp.ok) {
          setLoading(false);
          setFlag('mUsers');
        } else {
          Toast.show({
            text2: createUserResp?.data.message ?? 'Something went wrong',
            type: 'error',
          });
        }
        setLoading(false);
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
    }
  };
  return (
    <View>
      <OverlayLoader isShow={loading} />
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
          <MyTitle text="Add New User" />
        </Animated.View>
      </View>

      <View>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
          }}
          validationSchema={AddAdminForSchema.AddAdminForSchema}
          onSubmit={onSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={{ paddingHorizontal: 25 }}>
                <GapView />
                <Card
                  backgroundColor="#fff"
                  width={WINDOW_WIDTH - 50}
                  radius={12}>
                  <MyInput
                    placeholder="First Name"
                    placeholderColor="#CFCFCF"
                    onChangeText={handleChange('firstName')}
                    value={values.firstName}
                    containerStyle={{ marginVertical: 10 }}
                  />
                  <MyInput
                    placeholder="Last Name"
                    placeholderColor="#CFCFCF"
                    onChangeText={handleChange('lastName')}
                    value={values.lastName}
                    containerStyle={{ marginVertical: 10 }}
                  />
                  <MyInput
                    placeholder="Email"
                    placeholderColor="#CFCFCF"
                    onChangeText={handleChange('email')}
                    value={values.email}
                    containerStyle={{ marginVertical: 10 }}
                  />
                  {/* <MyInput
                    placeholder="Phone Number"
                    placeholderColor="#CFCFCF"
                    isPhoneCode
                    onChangeText={handleChange('phone')}
                    value={values.phone}
                    containerStyle={{ marginVertical: 10 }}
                  /> */}
                  <MyDropDown
                    title={''}
                    searchDisabled
                    placeholder="Role"
                    items={(userRoles as []) ?? []}
                    onChangeValue={e => setRoleId(e.id)}
                    width={WINDOW_WIDTH - 50}
                    containerPadding={0}
                  />
                </Card>
                {Object.entries(errors).map(([key, value]) => {
                  // @ts-ignore
                  if (touched[key]) {
                    if (roleId! < 1) {
                      setRoleError(true);
                    }
                    return (
                      <MyText
                        key={value}
                        text={value}
                        textStyle={{
                          color: 'red',
                          width: WINDOW_WIDTH - 110,
                          marginTop: 4,
                        }}
                      />
                    );
                  }
                })}
                {roleError && (
                  <MyText
                    text={'Role is required'}
                    textStyle={{
                      color: 'red',
                      width: WINDOW_WIDTH - 110,
                      marginTop: 4,
                    }}
                  />
                )}
              </View>
              <GapView length={30} />
              <View
                style={{
                  alignSelf: 'center',
                }}>
                <Rounded onPress={handleSubmit} label="Save" />
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}
