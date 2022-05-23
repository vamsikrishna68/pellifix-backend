import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {Profiles} from '../../models';
import {ProfilesRepository} from '../../repositories';

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
              marital_status: {type: 'string', enum: ['MARRIED', 'UNMARRID']},
              body_type: {type: 'string', enum: ['SLIM', 'CHUBBY', 'FAT']},
              age: {type: 'number'},
              physical_status: {type: 'string'},
              height: {type: 'number'},
              weight: {type: 'number'},
              religion: {type: 'string'},
              caste: {type: 'string'},
              sub_caste: {type: 'string'},
              zodiac: {type: 'string'},
              star: {type: 'string'},
              eating_habit: {type: 'string'},
              drinking_habit: {type: 'string'},
              smoking_habit: {type: 'string'},
              country: {type: 'string'},
              city: {type: 'string'},
              state: {type: 'string'},
              education: {type: 'string'},
              occupation: {type: 'string'},
              employeed_in: {type: 'string'},
              salary: {type: 'string'},
              mobileno: {type: 'string'},
              image: {type: 'string'},
              about_me: {type: 'string'},
              require_details: {type: 'string'},
              email_id: {type: 'string'},
              gender: {type: 'string'},
              profession: {type: 'string'},
              address: {type: 'string'},
              pincode: {type: 'string'},
              phoneno: {type: 'string'},
            },
          },
        },
      },
    })
    profile: Profiles,
  ): Promise<Profiles> {
    return this.profilesRepository.create(profile);
  }
}
