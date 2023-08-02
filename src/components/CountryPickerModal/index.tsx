import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
  TextStyle,
  SafeAreaView,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { CrossSvg } from '../../assets';
import { CountryFlags, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';
import { useHookstate } from '@hookstate/core';
import { externalStore } from '../../store/ExternalStore';
import { CountryCodes } from '../../types';
import MyText from '../MyText';
import GapView from '../GapView';
import { Theme, useTheme } from '@react-navigation/native';
import { Card, Wrapper } from '../../containers';
import MyInput from '../MyInput';

export default function CountryModal({
  visibleState = false,
  onCross = () => {},
  textStyle = {},
  onSetValue = e => {},
  searchPlaceholder = 'Enter Country Name ',
  EmptyMessage = 'No Country Available',
  isSearch = true,
}: {
  visibleState: boolean;
  onCross?: () => void;
  textStyle?: TextStyle;
  onSetValue?: (e: CountryCodes) => void;
  searchPlaceholder?: string;
  EmptyMessage?: string;
  isSearch?: true;
}) {
  const countries = useHookstate(externalStore.countryCodes).get();
  const [data, setData] = useState(countries);
  const { colors }: Theme = useTheme();

  const close = (e: CountryCodes) => {
    onSetValue(e);
    onCross();
  };

  const onSearch = (text: string) => {
    if (!text) {
      console.log('Countries', countries);
      setData(countries);
    } else {
      setData(
        countries.filter(country =>
          country.country.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }
  };
  const UnknownFlag = () => {
    return (
      <View
        style={{
          height: 15,
          width: 24,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MyText text="?" textStyle={{ color: '#fff' }} size={12} />
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      visible={visibleState}
      onRequestClose={onCross}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Wrapper
            showFooter={false}
            bgImageSpacer={false}
            onBackPress={onCross}>
            {() => {
              return (
                <View
                  style={{
                    top: 112,
                    width: WINDOW_WIDTH - 40,
                    alignSelf: 'center',
                  }}>
                  <View style={styles.crossView}>
                    <Card backgroundColor="#fff" width={WINDOW_WIDTH - 80}>
                      <MyInput
                        placeholder={searchPlaceholder}
                        onChangeText={onSearch}
                      />
                    </Card>
                  </View>
                  {/* <GapView /> */}
                  <View>
                    {data?.length !== 0 ? (
                      <FlatList
                        contentContainerStyle={[
                          {
                            flexGrow: 1,
                            width: WINDOW_WIDTH - 80,
                            alignSelf: 'center',
                            paddingBottom: 400,
                            marginTop: 10,
                          },
                        ]}
                        data={data}
                        ItemSeparatorComponent={GapView}
                        renderItem={({ item, index }) => {
                          // @ts-ignore
                          const Flag =
                            CountryFlags[item.iso_code] ?? UnknownFlag;
                          return (
                            <Card width={WINDOW_WIDTH - 85}>
                              <TouchableOpacity
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  margin: 10,
                                }}
                                onPress={() => close(item)}>
                                <Flag height={30} width={30} />
                                <GapView mode="horizontal" length={10} />
                                <View>
                                  <MyText
                                    text={item.country}
                                    textStyle={{ fontWeight: '700' }}
                                  />
                                  <MyText text={`(${item.code})`} size={10} />
                                </View>
                              </TouchableOpacity>
                            </Card>
                          );
                        }}
                        showsVerticalScrollIndicator={false}
                      />
                    ) : (
                      <Text style={[styles.defaultTextStyleEmpty]}>
                        {EmptyMessage}
                      </Text>
                    )}
                  </View>
                </View>
              );
            }}
          </Wrapper>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputserach: {
    marginTop: -8,
    marginLeft: 8,
    borderBottomWidth: 0.5,
    width: '100%',
  },
  inputStyle: {
    marginTop: Platform.OS === 'ios' ? 15 : 1,
    marginLeft: 6,
    fontSize: 15,
    color: '#474747',
    borderColor: '#474747',
    width: '100%',
  },

  crossView: {
    marginLeft: 20,
    marginTop: 50,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ImageStyle: {
    height: 22,
    width: 22,
    bottom: Platform.OS == 'ios' ? 10 : -5,
  },
  defaultTextStyle: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  defaultTextStyleEmpty: {
    alignSelf: 'center',
    flex: 1,
    fontSize: 16,
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    // alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
