import React from 'react';
import { StyleSheet } from 'react-native';
import { Shadow } from 'react-native-neomorph-shadows';
import { WINDOW_WIDTH } from '../../constants';

export default function Card({ children }: { children?: React.ReactNode }) {
  return (
    <Shadow style={{ ...styles.container, width: WINDOW_WIDTH, height: 56 }}>
      {children}
    </Shadow>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOpacity: 0.1,
    // shadowRadius: 15,
    borderRadius: 12,
    backgroundColor: '#db7575',
    paddingHorizontal: 20,
    // marginHorizontal: 30,
  },
});
