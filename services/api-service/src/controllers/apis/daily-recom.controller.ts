import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  response,
} from '@loopback/rest';
import {Profiles} from '../../models';
import {PreferenceRepository, ProfilesRepository} from '../../repositories';

export class DailyRecomController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
    @repository(PreferenceRepository)
    public preferenceRepository: PreferenceRepository,
    @inject('authUser')
    public authUser: any,
  ) {
    if (!this.authUser.pro_id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/v1/profiles/daily-recom')
  @response(200, {
    description: 'Array of Profiles model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Profiles, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Object[]> {
    const profile = await this.profilesRepository.findById(
      this.authUser.pro_id,
      {fields: {password: false}},
    );

    const preference = await this.preferenceRepository.findById(
      this.authUser.pro_id,
    );

    const gender = profile.gender === 'MALE' ? 'FEMALE' : 'MALE';

    const data = await this.preferenceRepository.getDailyRecomentation(
      gender,
      preference,
    );
    return [];
  }
}
