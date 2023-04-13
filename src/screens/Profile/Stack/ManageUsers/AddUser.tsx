import { Formik } from 'formik';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { api } from '../../../../api';
import {
  AddAdminIntoMasjid,
  CheckUserExists,
  CreateUser,
} from '../../../../api/userController';
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
}: {
  setFlag: (value: string) => void;
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
    } catch (error) {}
  };
  return (
    <ScrollView style={{ flexGrow: 1, marginTop: 90 }}>
      <OverlayLoader isShow={loading} />
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
            <View
              style={{
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextLabel label={'Add New User'} />
            </View>
            <View style={{ paddingHorizontal: 25 }}>
              <GapView />
              <Card width={345} radius={12}>
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
              {/* {console.log("errors", errors)} */}
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
              style={{ alignSelf: 'center', marginTop: 80, marginBottom: 10 }}>
              <Rounded onPress={handleSubmit} label="Save" />
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}
