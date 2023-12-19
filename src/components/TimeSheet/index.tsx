import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';

import MyText from '../MyText';
import GapView from '../GapView';

interface Props {
  heading: string;
  values: Array<string | null>;
}

export default function TimeSheet({ data }: { data: Array<Props> }) {
  const { colors } = useTheme();

  let mainData = ['Date', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const renderTable = ({ item, index }: { item: string; index: number }) => {
    return (
      <View key={index}>
        <View
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 8,
            paddingVertical: 5,
            borderColor: '#9E9F9F',
            borderWidth: 0.25,
          }}>
          <MyText
            text={item}
            textStyle={{
              color: '#ffffff',
              fontFamily: 'Roboto-Regular',
              textAlign: 'center',
            }}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          {data.map((head: Props | null, index: number) =>
            head?.heading.includes(item) ? (
              <View key={index}>
                <View
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    borderColor: '#9E9F9F',
                    borderWidth: 0.25,
                  }}>
                  <MyText
                    text={
                      head?.heading.includes('Adhan')
                        ? 'Adhan'
                        : head?.heading.includes('Iqama')
                        ? 'Iqama'
                        : head?.heading == 'Date'
                        ? '-'
                        : head?.heading ?? ''
                    }
                    textStyle={{
                      color: '#ffffff',
                      fontFamily: 'Roboto-Regular',
                      textAlign: 'center',
                    }}
                  />
                </View>
                {head.values.map((val: string | null, index: number) => (
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
                        fontFamily: 'Roboto-Regular',
                        textAlign: 'center',
                      }}
                    />
                  </View>
                ))}
              </View>
            ) : null,
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ paddingVertical: 10 }}>
      {data.length > 0 ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={mainData ?? []}
          ListHeaderComponent={<GapView mode="horizontal" />}
          ListFooterComponent={<GapView mode="horizontal" />}
          renderItem={renderTable}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({});
