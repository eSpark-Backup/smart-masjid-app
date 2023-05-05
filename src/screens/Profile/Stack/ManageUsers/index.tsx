import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
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
  OverlayLoader,
  TextLabel,
} from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { Card } from '../../../../containers';
import { userStore } from '../../../../store/UserStore';
import { UserResponse } from '../../../../types/userControllerApiResponse';

export default function ManageUsers({
  setFlag,
}: {
  setFlag: (value: string, user?: UserResponse) => void;
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
    <View style={{ flex: 1, marginTop: 110, alignItems: 'center' }}>
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
      <TextLabel label="Manage Users" />
      <GapView length={20} />
      <FlatList
        contentContainerStyle={{ flexGrow: 1, width: WINDOW_WIDTH }}
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
        ListFooterComponent={<AddUserBtn onPress={() => setFlag('addUser')} />}
      />
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
  return (
    <View style={{ marginTop: 10 }}>
      <Card>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.cardContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ProfileDummy height={30} width={30} />
            <GapView mode="horizontal" />
            <MyText text={item.firstName + ' ' + item.lastName} />
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
  return (
    <View style={{ marginTop: 10 }}>
      <Card>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.cardContainer}>
          <MyText text="Add New User" />
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
});
