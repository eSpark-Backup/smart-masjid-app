import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import React from 'react';
import MyText from '../MyText';

interface Props {
  heading: string;
  values: Array<string | null>;
}

export default function TimeSheet({ data }: { data: Array<Props> }) {
  const renderTable = ({ item, index }: { item: Props; index: number }) => {
    return (
      <View>
        <View
          style={{
            backgroundColor: '#6E6E6E',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderColor: '#9E9F9F',
            borderWidth: 0.25,
          }}>
          <MyText
            text={item.heading}
            textStyle={{
              fontSize: 16,
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
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderColor: '#9E9F9F',
              borderWidth: 0.25,
            }}>
            <MyText
              text={val ?? ''}
              textStyle={{
                fontSize: 16,
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
    <View style={{ marginTop: 30, paddingHorizontal: 22.5 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexDirection: 'row' }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          data={data ?? []}
          renderItem={renderTable}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
