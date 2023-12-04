import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Platform,
} from 'react-native';
import { ImmutableObject, useHookstate } from '@hookstate/core';
import { Theme, useTheme } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';

import {
  DeleteAdminFromMasjid,
  GetMasjidAdmins,
  LogoutUser,
} from '../../../../api/userController';
import { AddIcon, Delete, ProfileDummy } from '../../../../assets';
import {
  GapView,
  LogoutModal,
  MyText,
  MyTitle,
  OverlayLoader,
} from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { Card } from '../../../../containers';
import { userStore } from '../../../../store/UserStore';
import { UserResponse } from '../../../../types/userControllerApiResponse';

export default function ManageUsers({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string, user?: UserResponse) => void;
  contentOpacity?: any;
}) {
  const admins: any = useHookstate(userStore?.masjidAdmins).get();
  const userData: ImmutableObject<ImmutableObject<UserResponse>> | null =
    useHookstate(userStore?.userData).get();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState<{
    id: string;
    name: string;
  } | null>(null);
  useEffect(() => {
    setLoading(true);
    GetMasjidAdmins(userData?.masjid?.id.toString()!)
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        crashlytics().recordError(error as Error);
      });
  }, []);

  const onDelete = async () => {
    setIsVisible(null);
    setLoading(true);
    if (isVisible?.id == userData?.id.toString()) {
      await LogoutUser(userData?.id?.toString() ?? '', true);
      setLoading(false);
      return;
    }
    await DeleteAdminFromMasjid(
      isVisible?.id!,
      userData?.masjid?.id.toString()!,
    );
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, marginTop: 0, alignItems: 'center' }}>
      <LogoutModal
        message={`Are you sure you want to delete the user ${isVisible?.name}?`}
        visible={Boolean(isVisible)}
        onAllowed={onDelete}
        onClose={() => {
          setIsVisible(null);
          console.log('Cancelled');
        }}
      />
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
          <MyTitle text="Manage Users" />
        </Animated.View>
      </View>
      <GapView />
      <View>
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            width: WINDOW_WIDTH,
          }}
          data={admins ?? []}
          renderItem={({
            item,
            index,
          }: {
            item: UserResponse;
            index: number;
          }) => {
            return (
              <UserCard
                item={item}
                key={index}
                onPress={() => {
                  setFlag('vUser', item);
                }}
                onDeletePress={(id, name) => setIsVisible({ id, name })}
              />
            );
          }}
          ListFooterComponent={
            <AddUserBtn onPress={() => setFlag('addUser')} />
          }
        />
      </View>
    </View>
  );
}

const UserCard = ({
  item,
  onPress,
  onDeletePress,
}: {
  item: UserResponse;
  onPress: () => void;
  onDeletePress?: (userId: string, userName: string) => void;
}) => {
  return (
    <View style={{ marginTop: 10 }}>
      <Card width={WINDOW_WIDTH - 28}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.cardContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.avatarShadow}>
              <ProfileDummy height={30} width={30} />
            </View>
            <GapView mode="horizontal" />
            <View>
              <MyText
                text={item.firstName + ' ' + item.lastName}
                textStyle={{
                  color: '#0E0E0E',
                  //  fontWeight: '500',
                  fontFamily: 'Roboto-Medium',
                }}
              />
              <GapView length={5} />
              <MyText
                text={item.userType.name}
                size={12}
                textStyle={{
                  color: '#3E3E3E',
                  // fontWeight: '400',
                  fontFamily: 'Roboto-Regular',
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              onDeletePress?.(
                item.id.toString(),
                item.firstName + item.lastName,
              )
            }>
            <Delete />
          </TouchableOpacity>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const AddUserBtn = ({ onPress }: any) => {
  const { colors }: Theme = useTheme();
  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{
          ...styles.cardContainer,
          justifyContent: 'center',
          height: undefined,
        }}>
        <MyText
          text="Add User"
          textStyle={{
            color: colors.primary,
            //  fontWeight: '500',
            fontFamily: 'Roboto-Medium',
            fontSize: 16,
          }}
        />
        <GapView mode="horizontal" />
        <AddIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    height: 30,
    width: 30,
    borderRadius: 100,
  },
});
