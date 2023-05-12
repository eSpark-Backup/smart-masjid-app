import { useHookstate } from '@hookstate/core';
import { Theme, useTheme } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { UpdateUser } from '../../../../api/userController';

import {
  GapView,
  MyDivider,
  MyInput,
  MyText,
  OverlayLoader,
  ProfileAvatar,
  Rounded,
  TextLabel,
} from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { UserSetupSchema } from '../../../../constants/validations/schema';
import { Card } from '../../../../containers';
import { userStore } from '../../../../store/UserStore';

export default function ModifyAccount({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const { colors }: Theme = useTheme();
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const userObj = useHookstate(userStore.userData);
  const userData = userObj.get();
  const [data, setData] = useState({
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
    phone: userData?.phone,
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <OverlayLoader isShow={loading} />
      <View
        style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <TextLabel label={'Modify Account'} />
      </View>
      <View style={{ paddingHorizontal: 25 }}>
        <GapView />
        {!phoneUpdate ? (
          <Card width={345} radius={12}>
            <MyInput
              placeholder="Mukthar"
              placeholderColor="#CFCFCF"
              isDivider
              dividerWidth={0.25}
              onChangeText={(value: string) =>
                setData({ ...data, firstName: value })
              }
              value={data.firstName}
              dividerColor="rgba(158, 159, 159, 1)"
            />
            <MyInput
              placeholder="Ahmed"
              placeholderColor="#CFCFCF"
              isDivider
              onChangeText={(value: string) =>
                setData({ ...data, lastName: value })
              }
              value={data.lastName}
              dividerWidth={0.25}
              dividerColor="rgba(158, 159, 159, 1)"
            />
            <MyInput
              placeholder="muk.ahmed@gmail.com"
              onChangeText={(value: string) =>
                setData({ ...data, email: value })
              }
              placeholderColor="#CFCFCF"
              value={data.email}
            />
          </Card>
        ) : (
          <Formik
            initialValues={{ phone: data.phone?.replace('+1', '') }}
            validationSchema={UserSetupSchema.phoneForm}
            onSubmit={async values => {
              setLoading(true);
              await UpdateUser(userData?.id?.toString() || '', {
                phone: `+1${values.phone}`,
              });
              setLoading(false);
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <Card width={315}>
                  <MyInput
                    placeholder="Phone Number"
                    isPhoneCode
                    phoneCodeValue="US"
                    onChangeText={handleChange('phone')}
                    value={values.phone?.replace('+1', '')}
                  />
                </Card>
                {errors.phone && touched.phone && (
                  <MyText
                    text={errors.phone}
                    textStyle={{
                      color: 'red',
                      width: WINDOW_WIDTH - 110,
                      marginTop: 4,
                      left: 15,
                    }}
                  />
                )}
                <View
                  style={{
                    marginTop: 80,
                    marginBottom: 40,
                    alignItems: 'center',
                  }}>
                  <Rounded label="Update" width={250} onPress={handleSubmit} />
                  <GapView length={40} />
                  <MyText
                    text="Edit Profile Info"
                    pressable
                    textStyle={{
                      fontSize: 16,
                      fontWeight: '400',
                      color: colors.primary,
                    }}
                    onPress={() => setPhoneUpdate(false)}
                  />
                </View>
              </>
            )}
          </Formik>
        )}
      </View>

      {!phoneUpdate && (
        <View
          style={{
            alignSelf: 'center',
            marginTop: 80,
            marginBottom: 10,
            alignItems: 'center',
          }}>
          <Rounded
            label="Update"
            onPress={async () => {
              setLoading(true);
              await UpdateUser(userData?.id?.toString() || '', {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
              });
              setLoading(false);
            }}
          />
          <GapView length={40} />
          <MyText
            text="Edit Phone number"
            pressable
            textStyle={{
              fontSize: 16,
              fontWeight: '400',
              color: colors.primary,
            }}
            onPress={() => setPhoneUpdate(true)}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
