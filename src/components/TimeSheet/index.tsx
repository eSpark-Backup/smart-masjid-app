import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';

import MyText from '../MyText';
import GapView from '../GapView';
import { JumuahTimings } from '../../types/masjidControllerTypes';
import moment from 'moment';

interface Props {
  heading: string;
  values: Array<string | null>;
}

export default function TimeSheet({
  data,
  jummaData,
}: {
  data: Array<Props>;
  jummaData: JumuahTimings[];
}) {
  const { colors } = useTheme();

  let mainData = ['Date', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  let jummaHeadings = ['Date', 'Jumuah 1'];
  jummaData?.map(item => {
    if (item?.jumuah3) {
      console.log('jumuah3333');
      jummaHeadings[2] = 'Jumuah 2';
      jummaHeadings[3] = 'Jumuah 3';
    } else if (item?.jumuah2) {
      jummaHeadings[2] = 'Jumuah 2';
    }
  });

  const renderTable = ({ item, index }: { item: string; index: number }) => {
    return (
      <View key={index} style={{ paddingBottom: 5 }}>
        {item == 'Date' ? (
          <View
            style={{
              overflow: 'visible',
              backgroundColor: colors.primary,
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderColor: '#9E9F9F',
              borderWidth: 0.25,
              borderBottomColor: 'transparent',
            }}>
            <MyText
              text=" "
              textStyle={{
                color: '#ffffff',
                fontFamily: 'Roboto-Regular',
                textAlign: 'center',
              }}
            />
          </View>
        ) : null}
        {item == 'Date' ? (
          <View
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 8,
              paddingVertical: 5,
              position: 'absolute',
              top: 15,
              left: 20,
              zIndex: 1,
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
        ) : null}
        {item != 'Date' ? (
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
        ) : null}
        <View style={{ flexDirection: 'row' }}>
          {data?.map((head: Props | null, index: number) =>
            head?.heading.includes(item) ? (
              <View key={index}>
                <View
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    borderWidth: 0.25,
                    borderColor: '#9E9F9F',
                    borderTopColor:
                      head?.heading == 'Date' ? 'transparent' : '#9E9F9F',
                  }}>
                  <MyText
                    text={
                      head?.heading.includes('Adhan')
                        ? 'Adhan'
                        : head?.heading.includes('Iqama')
                        ? 'Iqama'
                        : head?.heading == 'Date'
                        ? ' '
                        : head?.heading ?? ''
                    }
                    textStyle={{
                      color: '#ffffff',
                      fontFamily: 'Roboto-Regular',
                      textAlign: 'center',
                    }}
                  />
                </View>
                {head?.values?.map((val: string | null, vIndex: number) => (
                  <View
                    key={vIndex}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 5,
                      borderColor: '#9E9F9F',
                      borderLeftWidth: index == 0 ? 0.25 : 0,
                      borderRightWidth: 0.25,
                      borderBottomWidth: 0.25,
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

  const renderJummaTable = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    return (
      <View key={index} style={{ paddingBottom: 5 }}>
        {item == 'Date' ? (
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
        ) : null}
        {item != 'Date' ? (
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
        ) : null}
        <View style={{}}>
          {jummaData?.map((data: JumuahTimings, dIndex: number) => (
            <View key={dIndex}>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  borderColor: '#9E9F9F',
                  borderLeftWidth: index == 0 ? 0.25 : 0,
                  borderRightWidth: 0.25,
                  borderBottomWidth: 0.25,
                }}>
                <MyText
                  text={
                    item == 'Date'
                      ? data?.date
                      : item == 'Jumuah 1'
                      ? data?.jumuah1!
                        ? moment(data?.jumuah1!, 'HH:mm:ss').format('hh:mm')
                        : '-'
                      : item == 'Jumuah 2'
                      ? data?.jumuah2!
                        ? moment(data?.jumuah2!, 'HH:mm:ss').format('hh:mm')
                        : '-'
                      : item == 'Jumuah 3'
                      ? data?.jumuah3!
                        ? moment(data?.jumuah3!, 'HH:mm:ss').format('hh:mm')
                        : '-'
                      : '-'
                  }
                  textStyle={{
                    color: '#3E3E3E',
                    fontFamily: 'Roboto-Regular',
                    textAlign: 'center',
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingVertical: 10, alignItems: 'center' }}>
      {data?.length > 0 ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={mainData ?? []}
          ListHeaderComponent={<GapView mode="horizontal" />}
          ListFooterComponent={<GapView mode="horizontal" />}
          renderItem={renderTable}
        />
      ) : null}
      <GapView length={20} />
      {jummaData?.length > 0 ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={jummaHeadings ?? []}
          ListHeaderComponent={<GapView mode="horizontal" />}
          ListFooterComponent={<GapView mode="horizontal" />}
          renderItem={renderJummaTable}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({});
