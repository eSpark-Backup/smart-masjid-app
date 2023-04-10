import React from 'react';
import { FlatList, View } from 'react-native';
import {
  DeviceListItem,
  GapView,
  MyDivider,
  TextLabel,
} from '../../../components';
import { Card } from '../../../containers';

const DeviceListing = ({ onPress }: { onPress?: () => void }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <GapView length={45} />
      <TextLabel label="Masjid Ar - Rahman" textStyle={{ paddingBottom: 5 }} />
      <GapView length={60} />
      <TextLabel
        label="Select Device"
        textStyle={{ color: '#3E3E3E', alignSelf: 'center' }}
      />
      <GapView length={80} />
      <Card>
        <View>
          <FlatList
            data={[
              { name: 'Home', subscription: 'No Subscription', online: true },
              { name: 'Home', subscription: 'No Subscription', online: false },
              { name: 'Home', subscription: 'Masjid Al Aqsa', online: true },
            ]}
            renderItem={({ item }) => (
              <DeviceListItem
                onPress={onPress}
                title={item.name}
                subTitle={item.subscription}
                disabled={
                  !(item.subscription == 'No Subscription' && item.online)
                }
                online={item.online}
              />
            )}
            ItemSeparatorComponent={() => (
              <MyDivider
                backgroundColor="#9E9F9F"
                height={0.25}
                style={{
                  paddingHorizontal: 20,
                  alignSelf: 'center',
                  width: '100%',
                }}
              />
            )}
          />
        </View>
      </Card>
    </View>
  );
};

export default DeviceListing;
