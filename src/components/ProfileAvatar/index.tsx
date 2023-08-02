import React from 'react';
import { ProfileDummy } from '../../assets';
import { Card } from '../../containers';

export default function ProfileAvatar() {
  return (
    <Card width={100} radius={100}>
      <ProfileDummy style={{ alignSelf: 'center' }} />
    </Card>
  );
}
