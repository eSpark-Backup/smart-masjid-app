import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Delete, PlusSvg, ProfileDummy } from '../../../../assets';
import { GapView, MyText, TextLabel } from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { Card } from '../../../../containers';

export default function ManageUsers({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1, marginTop: 110, alignItems: 'center' }}>
      <TextLabel label="Manage Users" />
      <GapView length={20} />
      <FlatList
        contentContainerStyle={{ flexGrow: 1, width: WINDOW_WIDTH }}
        data={Array(4).fill('2')}
        renderItem={({ item, index }) => {
          return (
            <UserCard
              item={item}
              key={index}
              onPress={() => {
                setFlag('vUser');
              }}
            />
          );
        }}
        ListFooterComponent={<AddUserBtn onPress={() => setFlag('addUser')} />}
      />
    </View>
  );
}

const UserCard = ({ item, onPress, onDeletePress }: any) => {
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
            <MyText text="Mudassir Raza" />
          </View>
          <View>
            <Delete />
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
