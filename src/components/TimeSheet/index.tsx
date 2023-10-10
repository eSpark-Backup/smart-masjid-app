import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';

import MyText from '../MyText';

interface Props {
  heading: string;
  values: Array<string | null>;
}

export default function TimeSheet({ data }: { data: Array<Props> }) {
  const { colors } = useTheme();
  const renderTable = ({ item, index }: { item: Props; index: number }) => {
    return (
      <View>
        <View
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 8,
            paddingVertical: 5,
            borderColor: '#9E9F9F',
            borderWidth: 0.25,
          }}>
          <MyText
            text={item.heading}
            textStyle={{
              color: '#ffffff',
              fontWeight: '400',
              textAlign: 'center',
            }}
          />
        </View>
        {item.values.map((val: string | null, index: number) => (
          <View
            key={index}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderColor: '#9E9F9F',
              borderWidth: 0.25,
            }}>
            <MyText
              text={val ?? ''}
              textStyle={{
                color: '#3E3E3E',
                fontWeight: '400',
                textAlign: 'center',
              }}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{}}
        data={data ?? []}
        renderItem={renderTable}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
