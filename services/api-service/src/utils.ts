import {Profiles} from '../src/models/index';
export const genProfileId = (num: number) => {
  return num.toString().padStart(6, '0');
};

export interface AuthUser {
  id: number;
  profile_id: string;
}

export const getRandomString = (length = 10) =>
  [...Array(length)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

export const age = (date: string) => {
  const current = new Date().getFullYear();
  const DOByear = new Date(date).getFullYear();
  return current - DOByear;
};

export const defaultPreference = (pro: Profiles) => {
  return {
    pro_id: pro.id,
    age: {
      from: 18,
      to: age(pro.dob),
    },
    height: {
      from: '5ft 1in',
      to: '6ft',
    },
  };
};
