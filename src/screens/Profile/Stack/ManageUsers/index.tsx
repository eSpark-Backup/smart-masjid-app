import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { useHookstate } from '@hookstate/core';

import {
  DeleteAdminFromMasjid,
  GetMasjidAdmins,
} from '../../../../api/userController';
import { Delete, PlusSvg, ProfileDummy } from '../../../../assets';
import {
  GapView,
  LogoutModal,
  MyText,
  MyTitle,
  OverlayLoader,
  TextLabel,
} from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { Card } from '../../../../containers';
import { userStore } from '../../../../store/UserStore';
import { UserResponse } from '../../../../types/userControllerApiResponse';
import { Theme, useTheme } from '@react-navigation/native';

export default function ManageUsers({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string, user?: UserResponse) => void;
  contentOpacity?: any;
}) {
  const admins: any = useHookstate(userStore?.masjidAdmins).get();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState('');
  useEffect(() => {
    setLoading(true);
    GetMasjidAdmins('1')
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const onDelete = async () => {
    setIsVisible('');
    setLoading(true);
    await DeleteAdminFromMasjid(isVisible, '1');
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, marginTop: 0, alignItems: 'center' }}>
      <LogoutModal
        message="Are you sure you want to delete this Masjid Admin?"
        visible={Boolean(isVisible)}
        onAllowed={onDelete}
        onClose={() => {
          setIsVisible('');
          console.log('Cancelled');
        }}
      />
      <OverlayLoader isShow={loading} />
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Manage Users" />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 100 }}>
        <GapView length={10} />
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            width: WINDOW_WIDTH,
            paddingBottom: 120,
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
                onDeletePress={setIsVisible}
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
  onDeletePress?: (userId: string) => void;
}) => {
  console.log(item.userType.name);
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
                textStyle={{ color: '#0E0E0E', fontWeight: '500' }}
              />
              <GapView length={5} />
              <MyText
                text={item.userType.name}
                size={12}
                textStyle={{ color: '#3E3E3E', fontWeight: '400' }}
              />
            </View>
          </View>
          <View>
            <Delete onPress={() => onDeletePress?.(item.id.toString())} />
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const AddUserBtn = ({ onPress }: any) => {
  const { colors }: Theme = useTheme();
  return (
    <View style={{ marginTop: 10 }}>
      <Card>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.cardContainer}>
          <MyText
            text="Add New User"
            textStyle={{ color: colors.primary, fontWeight: '700' }}
          />
          <PlusSvg height={16} width={16} />
        </TouchableOpacity>
      </Card>
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
