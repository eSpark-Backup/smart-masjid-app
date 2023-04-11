import { object, string, number, date, InferType } from 'yup';

export const UserSetupSchema = {
  emailForm: object({
    email: string().email('Invalid email').required('Email is required'),
  }),
  PersonalInfoForm: object({
    firstName: string()
      .min(2, 'First Name Too Short!')
      .max(50, 'First Name Too Long!')
      .required('First Name is Required'),
    lastName: string()
      .min(2, 'Last Name is Too Short!')
      .max(50, 'Last Name is Too Long!')
      .required('Last Name is Required'),
  }),
  phoneForm: object({
    phone: string()
      .matches(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        'Phone number is not valid',
      )
      .required('Phone No is Required'),
  }),
};

export const DeviceSetupSchema = {
  deviceNickName: object({
    nickName: string()
      .min(2, 'Device Name is Too Short!')
      .max(50, 'Device Name is Too Long!')
      .required('Device Name is Required'),
  }),
  wifiPassword: object({
    password: string().required('Password is required'),
  }),
};

export const AddAdminForSchema = {
  AddAdminForSchema: object({
    firstName: string()
      .min(2, 'First Name Too Short!')
      .max(50, 'First Name Too Long!')
      .required('First Name is Required'),
    lastName: string()
      .min(2, 'Last Name is Too Short!')
      .max(50, 'Last Name is Too Long!')
      .required('Last Name is Required'),
    email: string().email('Invalid email').required('Email is required'),
    phone: string()
      .matches(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        'Phone number is not valid',
      )
      .required('Phone No is Required'),
  }),
};
