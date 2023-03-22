import { object, string, number, date, InferType } from 'yup';

export const UserSetupSchema = {
  emailForm: object({
    email: string().email('Invalid email').required('Required'),
  }),
  PersonalInfoForm: object({
    firstName: string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastName: string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
  }),
  phoneForm: object({
    email: string().required('Required'),
  }),
};

export const DeviceSetupSchema = {
  deviceNickName: object({
    nickName: string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
  }),
  wifiPassword: object({
    password: string().required('Password is required'),
  })
};
