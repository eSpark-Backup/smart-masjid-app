import { object, string } from 'yup';

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const NAME_REGEX = /^[a-zA-Z0-9 ]*$/;

export const UserSetupSchema = {
  emailForm: object({
    email: string()
      .email('Invalid email')
      .required('Email is required')
      .matches(EMAIL_REGEX, { message: 'Invalid email' }),
  }),
  PersonalInfoForm: object({
    firstName: string()
      .min(2, 'First Name Too Short!')
      .max(50, 'First Name Too Long!')
      .required('First Name is Required')
      .matches(NAME_REGEX, {
        message: 'Please enter a valid first name',
      }),
    lastName: string()
      .min(2, 'Last Name is Too Short!')
      .max(50, 'Last Name is Too Long!')
      .required('Last Name is Required')
      .matches(NAME_REGEX, {
        message: 'Please enter a valid last name',
      }),
  }),
  phoneForm: object({
    phone: string()
      .matches(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        'Phone number is not valid',
      )
      .required('Phone No is Required'),
  }),
  optionalPhoneForm: object({
    phone: string().matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      'Phone number is not valid',
    ),
  }),
};

export const DeviceSetupSchema = {
  deviceNickName: object({
    nickName: string()
      .min(2, 'Device Name is Too Short!')
      .max(50, 'Device Name is Too Long!')
      .required('Device Name is Required')
      .matches(NAME_REGEX, {
        message: 'Please enter a valid device name',
      }),
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
      .required('First Name is Required')
      .matches(NAME_REGEX, {
        message: 'Please enter a valid first name',
      }),
    lastName: string()
      .min(2, 'Last Name is Too Short!')
      .max(50, 'Last Name is Too Long!')
      .required('Last Name is Required')
      .matches(NAME_REGEX, {
        message: 'Please enter a valid last name',
      }),
    email: string().email('Invalid email').required('Email is required'),
  }),
};
