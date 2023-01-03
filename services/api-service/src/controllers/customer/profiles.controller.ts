import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {Profiles} from '../../models';
import {ImagesRepository, ProfilesRepository} from '../../repositories';
import {AuthUser} from '../../utils';
import {replaceStaticValue} from '../profile-utils';
import {staticImageURL} from '../utils';

export class ProfilesController {
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

  @get('/v1/profiles')
  @response(200, {
    description: 'Profiles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profiles, {includeRelations: true}),
      },
    },
  })
  async findById(@param.query.string('type') type: string): Promise<Object> {
    let proimgs = await this.imagesRepository.find({
      where: {pro_id: this.authUser.id},
      fields: {url: true},
    });

    let profile = await this.profilesRepository.findById(this.authUser.id, {
      fields: {password: false, forget_hash: false},
    });

    //static image set
    profile.image = proimgs.length
      ? proimgs.find(x => x.primary_pic === true)?.url || staticImageURL
      : staticImageURL;

    const images = proimgs.length ? proimgs.map(x => x.url) : [];

    if (type === 'MOBILE') {
      const data = {...profile, ...replaceStaticValue(profile)};
      return {...data, images};
    }
    return {...profile, images};
  }

  @patch('/v1/profiles')
  async changePassowrd(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profiles, {
            includeRelations: false,
            partial: true,
            exclude: [
              'id',
              'password',
              'created_at',
              'created_by',
              'updated_at',
              'updated_by',
            ],
          }),
        },
      },
    })
    profile: Profiles,
  ): Promise<void> {
    await this.profilesRepository.updateById(this.authUser.id, profile);
  }
}
