import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import {
  GapView,
  MapBox,
  MyText,
  Rounded,
  TextLabel,
  TimeTable,
} from '../../../components';

const MasjidDetails = ({ onSubscribe }: { onSubscribe: () => void }) => {
  const [subscribe, setSubscribe] = useState(false);
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <GapView length={45} />
      <TextLabel label="Masjid Ar - Rahman" textStyle={{ paddingBottom: 5 }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
        <GapView length={15} />
        <MyText text="Method: Islamic Society of North America" size={16} />
        <GapView length={5} />
        <MyText
          text="Jurisdiction: Standard (Shafi, Hanbali, Maliki)"
          size={16}
        />
        <GapView length={20} />
        <MapBox />
        <GapView length={10} />
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
                name: 'Mugrib',
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
