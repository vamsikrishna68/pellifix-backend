import {repository} from '@loopback/repository';
import {HttpErrors, param, patch, post, requestBody} from '@loopback/rest';
import {Profiles} from '../../models';
import {PreferenceRepository, ProfilesRepository} from '../../repositories';
import {
  genPasswordHash,
  comparePassword,
} from '../../services/password-hash.service';
import {
  defaultPreference,
  genProfileId,
  getRandomString,
  age,
} from '../../utils';
import {genJwtToken} from '../../services/jwt-token.service';
import {sendMail} from '../../services/email.service';
export class CustomerController {
  constructor(
    @repository(PreferenceRepository)
    public preferenceRepository: PreferenceRepository,
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
  ) {}

  staticOtp = '12345';
  @post('/v1/customer/register')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              profile_creater: {type: 'string'},
              name: {type: 'string'},
              age: {type: 'number'},
              gender: {type: 'string'},
              mobileno: {type: 'string'},
              email_id: {type: 'string'},
              password: {type: 'string'},
              dob: {type: 'string', format: 'date'},
              referral_code: {type: 'string'},
            },
            required: ['mobileno', 'password', 'email_id', 'dob'],
          },
        },
      },
    })
    profile: Profiles,
  ): Promise<Object> {
    let {password, ...user} = profile;
    /**
     * mobile unique validation
     */
    const isAvailable = await this.profilesRepository.find({
      where: {or: [{mobileno: user.mobileno}, {email_id: user.email_id}]},
    });

    if (isAvailable.length) {
      throw new HttpErrors.UnprocessableEntity(
        'The mobile number or email already exist',
      );
    }

    /**
     * password hash
     */
    password = genPasswordHash(password);

    /**
     * Insert the data
     */
    user.age = age(user.dob);
    /**
     * Static OTP
     */
    user.otp = this.staticOtp;
    const res = await this.profilesRepository.create({...user, password});

    /**
     * Generate random id for customer and update in that profile
     */
    const profile_id = 'PM' + genProfileId(res.id!);
    await this.profilesRepository.updateById(res.id, {profile_id});

    /**
     *  Create default preference for profile
     */
    await this.preferenceRepository.create(defaultPreference(res));
    return {profile_id, ...user};
  }

  @patch('/v1/customer/otp/verify')
  async otpVerfication(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              mobileno: {type: 'string'},
              otp: {type: 'string'},
            },
            required: ['mobileno', 'otp'],
          },
        },
      },
    })
    pro: {
      mobileno: string;
      otp: string;
    },
  ): Promise<void> {
    const profile = await this.profilesRepository.findOne({
      where: {mobileno: pro.mobileno},
    });
    if (!profile)
      throw new HttpErrors.UnprocessableEntity("User doesn't exist");
    if (profile.otp !== pro.otp) {
      throw new HttpErrors.UnprocessableEntity("Otp doesn't match");
    }
    await this.profilesRepository.updateById(profile.id, {otp: ''});
  }

  @patch('/v1/customer/otp/generate')
  async otpGenerate(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              mobileno: {type: 'string'},
            },
            required: ['mobileno'],
          },
        },
      },
    })
    pro: {
      mobileno: string;
    },
  ): Promise<void> {
    const profile = await this.profilesRepository.findOne({
      where: {mobileno: pro.mobileno},
    });

    if (!profile) {
      throw new HttpErrors.UnprocessableEntity("User doesn't exist");
    }
    await this.profilesRepository.updateById(profile.id, {otp: this.staticOtp});
  }

  @post('/v1/customer/login')
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
  ): Promise<{name: string; profile_id: string; token: string}> {
    const user = await this.profilesRepository.findOne({
      where: {email_id: pro.email_id},
    });

    if (!user) {
      throw new HttpErrors[401]('User does not exist');
    }
    const isValid: boolean = await comparePassword(pro.password, user.password);

    if (!isValid) {
      throw new HttpErrors[401]('Incorrect password');
    }

    const token = genJwtToken({
      id: user.id!,
      name: user.name!,
      profile_id: user.profile_id!,
    });

    return {profile_id: user.profile_id!, name: user.name!, token};
  }

  /**
   * password reset API's
   */

  @post('/v1/customer/password/reset')
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
    const profile = await this.profilesRepository.findOne({
      where: {email_id: pro.email_id},
    });

    if (!profile) {
      throw new HttpErrors[401](`User doesn't found`);
    }

    const forget_hash = getRandomString(50);
    await this.profilesRepository.updateById(profile.id, {forget_hash});

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

  @patch('/v1/customer/password/update/{hash}')
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
    const profile = await this.profilesRepository.findOne({
      where: {forget_hash: hash},
    });

    if (!profile) {
      throw new HttpErrors[401](`Not valid hash`);
    }
    /**
     * password hash
     */
    const password = genPasswordHash(pro.password);
    await this.profilesRepository.updateById(profile.id, {
      password,
      forget_hash: '',
    });
  }
}
