import { Formik } from 'formik';
import React, { useState } from 'react';
import { ScrollView, View, Animated, Platform } from 'react-native';
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
  TextLabel,
} from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { AddAdminForSchema } from '../../../../constants/validations/schema';
import { Card } from '../../../../containers';
import { CreateUserRequest } from '../../../../types/userControllerApiResponse';

export default function AddUsers({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => {
    try {
      setLoading(true);
      // Check if user already exists
      const data: any = await CheckUserExists(values.email, values.phone);
      const obj: CreateUserRequest = {
        ...values,
        email: values.email?.toLowerCase(),
        phone: '+1' + values.phone,
        userType: 'Masjid Admin',
        masjidId: '1',
      };
      // If user already exists so direct add to masjid
      if (data) {
        const res = await AddAdminIntoMasjid(data?.id?.toString(), '1');
        setLoading(false);
        if (res) setFlag('mUsers');
      } else {
        // Else Create User with current masjid
        const createUserResp: any = await api.post('/users', obj);
        if (createUserResp.data) {
          setLoading(false);
          setFlag('mUsers');
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
            phone: '',
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
                <Card backgroundColor="#ffffff" width={345} radius={12}>
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
                  <MyInput
                    placeholder="Phone Number"
                    placeholderColor="#CFCFCF"
                    isPhoneCode
                    onChangeText={handleChange('phone')}
                    value={values.phone}
                    containerStyle={{ marginVertical: 10 }}
                  />
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
                  // marginTop: 80,
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
