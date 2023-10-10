import React, { useState } from 'react';
import { ActivityIndicator, ImageSourcePropType } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { View } from 'react-native-animatable';
import FastImage, { FastImageProps } from 'react-native-fast-image';

interface CachedImageProps extends FastImageProps {
  style: FastImageProps['style'];
  source: FastImageProps['source'] & string & ImageSourcePropType;
}

export default function CachedImage({
  style,
  source,
  ...rest
}: CachedImageProps): React.ReactElement {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const imageSource = {
    uri: source?.uri,
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable,
  };

  return (
    <>
      <FastImage
        style={[style, { display: loading ? 'none' : 'flex' }]}
        source={source?.uri ? imageSource : source}
        {...rest}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <View
          style={[
            { flex: 1, justifyContent: 'center', alignItems: 'center' },
            style,
          ]}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
    </>
  );
}
