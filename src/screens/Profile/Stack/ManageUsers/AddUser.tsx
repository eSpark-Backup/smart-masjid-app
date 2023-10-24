import { Formik } from 'formik';
import React, { useState } from 'react';
import { View, Animated, Platform } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

import { api } from '../../../../api';
import { CheckUserExists } from '../../../../api/externalControllers';
import { AddAdminIntoMasjid } from '../../../../api/userController';
import {
  GapView,
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
  const userData: ImmutableObject<ImmutableObject<UserResponse>> | null =
    useHookstate(userStore?.userData).get();
  const onSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    try {
      setLoading(true);
      // Check if user already exists
      const data: any = await CheckUserExists(values.email, '');
      const obj: CreateUserRequest = {
        ...values,
        email: values.email?.toLowerCase(),
        userTypeId: 2,
        masjidId: userData?.masjid?.id.toString(),
      };
      // If user already exists so direct add to masjid
      if (data) {
        const res = await AddAdminIntoMasjid(data?.id?.toString(), '1');
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
                </Card>
                {Object.entries(errors).map(([key, value]) => {
                  // @ts-ignore
                  if (touched[key]) {
                    return (
                      <MyText
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
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
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
