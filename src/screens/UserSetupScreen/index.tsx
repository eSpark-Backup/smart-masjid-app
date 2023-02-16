import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Wrapper } from '../../containers';
import { EmailForm } from '../../forms';

export default function UserSetupScreen() {
  return (
    <Wrapper>
      <EmailForm />
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
