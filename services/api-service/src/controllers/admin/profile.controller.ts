import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {PaymentHistory, ProfileAssist, Profiles} from '../../models';
import {
  PaymentHistoryRepository,
  ProfileAssistRepository,
  ProfilesRepository,
} from '../../repositories';
import {AuthUser, genProfileId} from '../../utils';
import {replaceStaticValue} from '../profile-utils';
export class AdminProfilesController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
    @repository(PaymentHistoryRepository)
    public paymentHistoryRepository: PaymentHistoryRepository,
    @repository(ProfileAssistRepository)
    public profileAssistRepository: ProfileAssistRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/cp/v1/profiles')
  @response(200, {
    description: 'Array of Profiles model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Profiles, {
            includeRelations: true,
            exclude: [
              'id',
              'password',
              'created_at',
              'created_by',
              'updated_at',
              'updated_by',
              'forget_hash',
            ],
          }),
        },
      },
    },
  })
  async find(
    @param.filter(Profiles) filter?: Filter<Profiles>,
  ): Promise<Profiles[]> {
    return this.profilesRepository.find({
      ...filter,
      fields: {
        password: false,
        created_by: false,
        updated_by: false,
        forget_hash: false,
      },
    });
  }

  @get('/cp/v1/profiles/{id}')
  @response(200, {
    description: 'Profiles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profiles, {
          includeRelations: true,
          exclude: [
            'id',
            'password',
            'created_at',
            'created_by',
            'updated_at',
            'updated_by',
            'forget_hash',
          ],
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Profiles, {exclude: 'where'})
    filter?: FilterExcludingWhere<Profiles>,
  ): Promise<Object> {
    const profile = await this.profilesRepository.findById(id, {
      ...filter,
      fields: {
        password: false,
        forget_hash: false,
        created_by: false,
        updated_by: false,
      },
    });

    const assist = await this.profileAssistRepository.find({
      where: {
        profile_id: id,
      },
    });

    const profileIds = assist.map(x => x.selected_id);
    const profiles = profileIds.length
      ? await this.profileAssistRepository.getProfileAssist(profileIds)
      : [];

    const data = profiles.map((profile: any) => {
      profile.is_liked = Boolean(profile.is_liked);
      const staticdata = replaceStaticValue(profile);
      return {
        ...profile,
        ...staticdata,
      };
    });

    return {
      ...profile,
      assist: data,
    };
  }

  @post('/cp/v1/profiles')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profiles, {
            includeRelations: false,
            partial: true,
            exclude: [
              'id',
              'profile_id',
              'password',
              'created_at',
              'created_by',
              'updated_at',
              'updated_by',
              'forget_hash',
            ],
          }),
        },
      },
    })
    profile: Profiles,
  ): Promise<Object> {
    profile.created_by = this.authUser.id;

    const res = await this.profilesRepository.create(profile);
    /**
     * Generate random id for customer and update in that profile
     */

    const profile_id = 'PM' + genProfileId(res.id!);
    await this.profilesRepository.updateById(res.id, {profile_id});
    return {profile_id: profile_id};
  }

  @patch('/cp/v1/profiles/{id}')
  async changePassowrd(
    @param.path.number('id') id: number,
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
              'forget_hash',
            ],
          }),
        },
      },
    })
    profile: Profiles,
  ): Promise<void> {
    profile.updated_by = this.authUser.id;
    await this.profilesRepository.updateById(id, profile);
  }

  @post('/cp/v1/profiles/assist')
  async profileAssist(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              profile_id: {type: 'number'},
              selected_id: {type: 'number'},
            },
          },
        },
      },
    })
    assist: ProfileAssist,
  ): Promise<Object> {
    const profile = await this.profileAssistRepository.findOne({
      where: {profile_id: assist.profile_id, selected_id: assist.selected_id},
    });
    if (profile) {
      return {
        message: 'Already record inserted',
      };
    }
    return this.profileAssistRepository.create({
      profile_id: assist.profile_id,
      selected_id: assist.selected_id,
    });
  }

  @get('/cp/v1/profiles/payment/{id}')
  @response(200, {
    description: 'Profile payment list and details',
  })
  async getPaymet(
    @param.path.number('id') id: number,
  ): Promise<PaymentHistory[]> {
    return this.paymentHistoryRepository.find({where: {profile_id: id}});
  }

  @del('/cp/v1/profiles/{id}')
  @response(204, {
    description: 'Profile DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.profilesRepository.deleteById(id);
  }
}
