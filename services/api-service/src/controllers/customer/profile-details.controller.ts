import {inject} from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  requestBody,
  response,
} from '@loopback/rest';
import {Profiles} from '../../models';
import {ImagesRepository, ProfilesRepository} from '../../repositories';
import {AuthUser} from '../../utils';
import {replaceStaticValue} from '../profile-utils';
import {staticImageURL} from '../utils';

export class ProfilesDetailsController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
    @repository(ImagesRepository)
    public imagesRepository: ImagesRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/v1/profiles/details/{id}')
  @response(200, {
    description: 'Profiles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profiles, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Profiles, {exclude: 'where'})
    filter?: FilterExcludingWhere<Profiles>,
  ): Promise<Object> {
    let proimgs = await this.imagesRepository.find({
      where: {pro_id: id},
      fields: {url: true},
    });

    let profile = await this.profilesRepository.findById(id, {
      fields: {password: false, forget_hash: false},
    });

    //static image set
    profile.image = proimgs.length
      ? proimgs.find(x => x.primary_pic === true)?.url || staticImageURL
      : staticImageURL;

    const data = {...profile, ...replaceStaticValue(profile)};
    const images = proimgs.length ? proimgs.map(x => x.url) : [];

    return {...data, images};
  }
  @get('/v1/profiles/compare')
  @response(200, {
    description: 'Profiles compare instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profiles, {includeRelations: true}),
      },
    },
  })
  async profileCompare(
    @param.query.string('profile_ids', {required: true}) profileIds: string,
  ): Promise<Object[]> {
    const profile = profileIds.split(',').map(x => Number(x));
    if (profile.length !== 2) {
      throw new HttpErrors.UnprocessableEntity('Two profile ids required');
    }
    const profile_1 = await this.findById(profile[0]);
    const profile_2 = await this.findById(profile[1]);

    return profile_1 && profile_2 ? [profile_1, profile_2] : [];
  }
}
