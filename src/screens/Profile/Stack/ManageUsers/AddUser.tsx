import { Formik } from 'formik';
import React, { useState } from 'react';
import { ScrollView, View, Animated } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

import { api } from '../../../../api';
import { CheckUserExists } from '../../../../api/externalControllers';
import { AddAdminIntoMasjid } from '../../../../api/userController';
import {
  GapView,
  MyInput,
  MyText,
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
    <ScrollView style={{ flexGrow: 1, marginTop: 0 }}>
      <OverlayLoader isShow={loading} />
      <GapView length={20} />
      <TextLabel label="" textStyle={{ alignSelf: 'center' }} />
      <GapView length={50} />

      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel label="Add New User" textStyle={{ alignSelf: 'center' }} />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 100 }}>
        <Formik
          initialValues={{ firstName: '', lastName: '', email: '', phone: '' }}
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
                    isDivider
                    dividerWidth={0.25}
                    dividerColor="rgba(158, 159, 159, 1)"
                    onChangeText={handleChange('firstName')}
                    value={values.firstName}
                  />
                  <MyInput
                    placeholder="Last Name"
                    placeholderColor="#CFCFCF"
                    isDivider
                    dividerWidth={0.25}
                    dividerColor="rgba(158, 159, 159, 1)"
                    onChangeText={handleChange('lastName')}
                    value={values.lastName}
                  />
                  <MyInput
                    placeholder="Email"
                    placeholderColor="#CFCFCF"
                    isDivider
                    dividerWidth={0.25}
                    dividerColor="rgba(158, 159, 159, 1)"
                    onChangeText={handleChange('email')}
                    value={values.email}
                  />
                  <MyInput
                    placeholder="Phone Number"
                    placeholderColor="#CFCFCF"
                    isDivider={false}
                    dividerWidth={0.25}
                    dividerColor="rgba(158, 159, 159, 1)"
                    isPhoneCode
                    phoneCodeContainerStyle={{ borderTopLeftRadius: 0 }}
                    onChangeText={handleChange('phone')}
                    value={values.phone}
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
                  marginTop: 80,
                  marginBottom: 10,
                }}>
                <Rounded onPress={handleSubmit} label="Save" />
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}
