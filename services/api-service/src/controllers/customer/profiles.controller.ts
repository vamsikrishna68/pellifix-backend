import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {Profiles} from '../../models';
import {
  DeletedProfileRepository,
  ImagesRepository,
  PreferenceRepository,
  ProfileAssistRepository,
  ProfilesRepository,
} from '../../repositories';
import {AuthUser} from '../../utils';
import {replaceStaticValue} from '../profile-utils';
import {staticImageURL} from '../utils';

export class ProfilesController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
    @repository(ImagesRepository)
    public imagesRepository: ImagesRepository,
    @repository(DeletedProfileRepository)
    public deletedProfileRepository: DeletedProfileRepository,
    @repository(ProfileAssistRepository)
    public profileAssistRepository: ProfileAssistRepository,
    @repository(PreferenceRepository)
    public preferenceRepository: PreferenceRepository,
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

  @get('/v1/profiles/assist')
  @response(200, {
    description: 'Profiles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profiles, {includeRelations: true}),
      },
    },
  })
  async assist(@param.query.string('type') type: string): Promise<Object[]> {
    const assistProfiles = await this.profileAssistRepository.find({
      where: {profile_id: this.authUser.id},
    });
    if (!assistProfiles.length) {
      return [];
    }

    const profileIds = assistProfiles.map(x => x.selected_id);
    const profiles = await this.profileAssistRepository.getProfileAssist(
      profileIds,
    );

    const data = profiles.map((profile: any) => {
      profile.is_liked = Boolean(profile.is_liked);
      const staticdata = replaceStaticValue(profile);
      return {
        ...profile,
        ...staticdata,
      };
    });
    return data;
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

  @get('/v1/profiles/membership')
  @response(200, {
    description: 'Check the profile is membership enabled or not',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profiles, {includeRelations: true}),
      },
    },
  })
  async getMembership(): Promise<Object> {
    const profile = await this.profilesRepository.findById(this.authUser.id);

    return {
      profile_id: profile.profile_id,
      is_membership: profile.is_membership,
    };
  }
  @del('/v1/profiles')
  @response(204, {
    description: 'Admin DELETE success',
  })
  async deleteById(): Promise<void> {
    const profile = await this.profilesRepository.findById(this.authUser.id);
    await this.deletedProfileRepository.create({
      profile_info: profile,
      deleted_by: 'USER',
    });

    await this.profilesRepository.deleteById(this.authUser.id);
    await this.preferenceRepository.deleteById(this.authUser.id);
    await this.imagesRepository.deleteAll({pro_id: this.authUser.id});
  }
}
