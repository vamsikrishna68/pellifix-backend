import {repository} from '@loopback/repository';
import {HttpErrors, patch, post, requestBody} from '@loopback/rest';
import {Profiles} from '../../models';
import {ProfilesRepository} from '../../repositories';
import {genPasswordHash} from '../../services/password-hash';
import {genProfileId} from '../../utils';
export class CustomerController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
  ) {}

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
            required: ['mobileno', 'password', 'email_id'],
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
    const res = await this.profilesRepository.create({...user, password});

    /**
     * Generate random id for customer and update in that profile
     */
    const profile_id = 'PM' + genProfileId(res.id!);
    await this.profilesRepository.updateById(res.id, {profile_id});

    return {profile_id, ...user};
  }

  @patch('/v1/customer/mobile-verify')
  async otpVerfication(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              mobileno: {type: 'string'},
              is_valid_no: {type: 'boolean'},
            },
            required: ['is_valid_no'],
          },
        },
      },
    })
    pro: {
      is_valid_no: boolean;
      mobileno: string;
    },
  ): Promise<void> {
    await this.profilesRepository.updateAll(
      {is_mobileno: pro.is_valid_no},
      {mobileno: pro.mobileno},
    );
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
    profile: Profiles,
  ): Promise<void> {}
}
