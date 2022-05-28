import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {Profiles} from '../../models';
import {ProfilesRepository} from '../../repositories';
import {genPasswordHash} from '../../services/password-hash';
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
              phoneno: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['phoneno', 'password'],
          },
        },
      },
    })
    profile: Profiles,
  ): Promise<Object> {
    let {password, ...user} = profile;

    password = genPasswordHash(password);
    const res = await this.profilesRepository.create({...user, password});

    return {pro_id: res.pro_id, ...user};
  }
}
