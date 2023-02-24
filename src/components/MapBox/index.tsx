import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { Card } from '../../containers';

export default function MapBox({
  latitude = 37.78825,
  longitude = -122.4324,
}: {
  latitude?: number;
  longitude?: number;
}) {
  return (
    <Card>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        mapPadding={{ bottom: 100, top: 100, left: 100, right: 100 }}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 180,
    borderRadius: 100,
  },
});
