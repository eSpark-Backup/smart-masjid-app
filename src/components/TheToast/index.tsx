import React from 'react';
import { StyleSheet } from 'react-native';
import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ToastProvider() {
  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={styles.successStyle}
        text1Style={styles.text1Style}
        text2Style={styles.text2Style}
        text1={props.text1 ?? 'Success!'}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props: BaseToastProps) => (
      <ErrorToast
        {...props}
        style={styles.errorStyle}
        text1Style={styles.text1Style}
        text2Style={styles.text2Style}
        text1={props.text1 ?? 'Error!'}
      />
    ),

    warning: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={styles.warningStyle}
        text1Style={styles.text1Style}
        text2Style={styles.text2Style}
        text1={props.text1 ?? 'Warning!'}
      />
    ),
  };

  return (
    <Toast
      config={toastConfig}
      topOffset={useSafeAreaInsets().top}
      visibilityTime={5000}
    />
  );
}

export const showToast = (
  message: string,
  type: 'error' | 'success' | 'warning',
  title?: string,
  visibilityTime: number | undefined = 4000,
) => {
  Toast.show({
    text1: title, // Display the message
    text2: message, // Display the message
    type: type, // Default to success, but you can pass 'error', 'info', etc.
    visibilityTime,
  });
};

const styles = StyleSheet.create({
  successStyle: { width: '90%', borderLeftColor: '#0097A3' },
  errorStyle: { width: '90%', borderLeftColor: '#FF6464' },
  warningStyle: { width: '90%', borderLeftColor: '#f2be09' },
  text1Style: {
    fontFamily: 'roboto',
    fontSize: 14,
  },
  text2Style: {
    fontFamily: 'roboto',
    fontSize: 12,
  },
});
