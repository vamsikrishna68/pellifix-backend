const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

/**
 * Generate password
 * @param password
 * @returns
 */
export const genPasswordHash = (password: string) => {
  return bcrypt.hashSync(password, salt);
};
/**
 * comapare password
 * @param password
 * @param passHash
 * @returns
 */
export const comparePassword = async (password: string, passHash: string) => {
  return bcrypt.compare(password, passHash).then((res: any) => res);
};
