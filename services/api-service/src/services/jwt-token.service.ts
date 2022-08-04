import {sign, verify} from 'jsonwebtoken';

export const genJwtToken = (user: {
  id: number;
  name: string;
  profile_id: string;
}) => {
  return sign(user, process.env.JWT_SECRET!);
};

export const verifyJwt = (token: string) => {
  return verify(token, process.env.JWT_SECRET!);
};
