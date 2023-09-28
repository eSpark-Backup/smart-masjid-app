import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { Card } from '../../containers';
import { WINDOW_WIDTH } from '../../constants';

export default function MapBox({
  latitude = 37.78825,
  longitude = -122.4324,
}: {
  latitude?: number;
  longitude?: number;
}) {
  return (
    <Card width={WINDOW_WIDTH - 28}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        scrollEnabled={false}
        zoomEnabled
        rotateEnabled
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 180,
  },
});
