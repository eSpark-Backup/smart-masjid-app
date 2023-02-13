import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '../../containers';

export default function MyInput() {
  return (
    <Card>
      <TextInput autoComplete="off" autoCorrect={false} placeholder={'Email'} />
    </Card>
  );
}

const styles = StyleSheet.create({});
