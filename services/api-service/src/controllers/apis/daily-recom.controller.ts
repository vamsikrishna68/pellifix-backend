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
import {ProfilesRepository} from '../../repositories';

export class DailyRecomController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
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
  async find(
    @param.filter(Profiles) filter?: Filter<Profiles>,
  ): Promise<Profiles[]> {
    const profile = await this.profilesRepository.findById(
      this.authUser.pro_id,
      {fields: {password: false}},
    );
    //Add more filters
    const gender = profile.gender === 'MALE' ? 'FEMALE' : 'MALE';
    filter = {...filter, where: {...(filter && filter.where), gender}};

    return this.profilesRepository.find({
      ...filter,
      fields: {
        id: true,
        profile_id: true,
        profile_creater: true,
        name: true,
        marital_status: true,
        body_type: true,
        dob: true,
        age: true,
        physical_status: true,
        height: true,
        weight: true,
        religion: true,
        caste: true,
        sub_caste: true,
        zodiac: true,
        star: true,
        country: true,
        city: true,
        state: true,
        education: true,
        occupation: true,
        image: true,
        about_me: true,
        is_membership: true,
        gender: true,
        profession: true,
      },
    });
  }
}
