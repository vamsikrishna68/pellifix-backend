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
              age: {type: 'number'},
              gender: {type: 'string'},
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
