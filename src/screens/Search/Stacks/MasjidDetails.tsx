import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, Animated } from 'react-native';
import {
  GapView,
  MapBox,
  MyText,
  Rounded,
  TextLabel,
  TimeTable,
} from '../../../components';
import { Masjid } from '../../../types/masjidControllerTypes';
import { AdhanCalculation, AdhanJuristic } from '../../../assets';
import { WINDOW_HEIGHT } from '../../../constants';

const MasjidDetails = ({
  onSubscribe,
  masjidDetails,
  contentOpacity = 0,
}: {
  onSubscribe: () => void;
  masjidDetails?: Masjid;
  contentOpacity?: any;
}) => {
  const [subscribe, setSubscribe] = useState(false);

  return (
    <View
      style={{ flex: 1, alignItems: 'center'}}>
      <View style={{ alignSelf: 'center', top: 100 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label="Masjid Search"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <ScrollView
        style={{ top: 100 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <AdhanCalculation />
          <GapView length={5} mode="horizontal" />
          <MyText
            text="Islamic Society of North America"
            size={16}
            textStyle={{ color: '#3E3E3E' }}
          />
        </View>
        <GapView length={5} />
        <View style={{ flexDirection: 'row' }}>
          <AdhanJuristic />
          <GapView length={5} mode="horizontal" />
          <MyText
            text={`Jurisdiction: ${
              masjidDetails?.masjidAdhanConfig?.adhanJuristicConfig?.name ?? '-'
            }`}
            size={16}
            textStyle={{ color: '#3E3E3E' }}
          />
        </View>
        <GapView length={20} />
        <View style={{ padding: 10 }}>
          <TimeTable
            data={[
              {
                name: 'Fajar',
                azanTiming: '5:50',
                iqamahTiming: '6:00',
              },
              {
                name: 'Dhuhr',
                azanTiming: '1:00',
                iqamahTiming: '1:30',
              },
              {
                name: 'Asr',
                azanTiming: '4:50',
                iqamahTiming: '5:00',
              },
              {
                name: 'Maghrib',
                azanTiming: '5:50',
                iqamahTiming: '6:00',
              },
              {
                name: 'Isha',
                azanTiming: '6:50',
                iqamahTiming: '8:00',
              },
            ]}
          />
        </View>
        <GapView />
        {!subscribe ? (
          <Rounded
            onPress={onSubscribe}
            disabled={false}
            label="Subscribe"
            width={'70%'}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              height: 41,
              width: '70%',
              backgroundColor: '#FF6464',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
            onPress={() => setSubscribe(!subscribe)}>
            <TextLabel label="Unsubscribe" textStyle={{ color: '#ffffff' }} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default MasjidDetails;
