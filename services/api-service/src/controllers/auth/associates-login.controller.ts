import {repository} from '@loopback/repository';
import {HttpErrors, param, patch, post, requestBody} from '@loopback/rest';
import {AdminRepository} from '../../repositories';
import {
  genPasswordHash,
  comparePassword,
} from '../../services/password-hash.service';
import {getRandomString} from '../../utils';
import {genJwtToken} from '../../services/jwt-token.service';
import {sendMail} from '../../services/email.service';
import {ROLES} from '../utils';
export class AssociatesLoginController {
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
  ) {}

  @post('/cp/v1/associates/auth/login')
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              email_id: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['email_id', 'password'],
          },
        },
      },
    })
    pro: {
      email_id: string;
      password: string;
    },
  ): Promise<{name: string; id: number; token: string}> {
    const user = await this.adminRepository.findOne({
      where: {email_id: pro.email_id, role_id: ROLES.SUB_ORDINATES},
    });

    if (!user) {
      throw new HttpErrors[401]('User does not exist');
    }

    if (!user.password) {
      throw new HttpErrors[401]('Need to update your password');
    }

    const isValid: boolean = await comparePassword(pro.password, user.password);
    if (!isValid) {
      throw new HttpErrors[401]('Incorrect password');
    }
    const token = genJwtToken({
      id: user.id!,
      name: user.username,
      profile_id: '',
    });
    return {id: user.id!, name: user.username!, token};
  }

  /**
   * password reset API's
   */

  @post('/cp/v1/associates/auth/password/reset')
  async passwordReset(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              email_id: {type: 'string'},
            },
            required: ['email_id'],
          },
        },
      },
    })
    pro: {
      email_id: string;
    },
  ): Promise<Object> {
    const profile = await this.adminRepository.findOne({
      where: {email_id: pro.email_id, role_id: ROLES.SUB_ORDINATES},
    });

    if (!profile) {
      throw new HttpErrors[401](`User doesn't found`);
    }

    const forget_hash = getRandomString(50);
    await this.adminRepository.updateById(profile.id, {forget_hash});

    sendMail({
      to: profile.email_id,
      subject: 'Password reset link',
      body: `Your account password reset link https://pellifix.com/reset-password/${forget_hash}`,
    });

    return {
      message: 'Reset password link send successfully',
      hash: forget_hash,
    };
  }

  @patch('/cp/v1/associates/auth/password/update/{hash}')
  async passwordUpdate(
    @param.path.string('hash') hash: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              password: {type: 'string'},
            },
            required: ['password'],
          },
        },
      },
    })
    pro: {
      password: string;
    },
  ): Promise<void> {
    const profile = await this.adminRepository.findOne({
      where: {forget_hash: hash},
    });

    if (!profile) {
      throw new HttpErrors[401](`Not valid hash`);
    }
    /**
     * password hash
     */
    const password = genPasswordHash(pro.password);
    await this.adminRepository.updateById(profile.id, {
      password,
      forget_hash: '',
    });
  }
}
