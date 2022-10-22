import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Admin} from '../../models';
import {AdminRepository, EarningsRepository} from '../../repositories';
import {AuthUser} from '../../utils';
import {ROLES} from '../utils';

export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
    @repository(EarningsRepository)
    public earningsRepository: EarningsRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @post('/cp/v1/sub-ordinates')
  @response(200, {
    description: 'Admin model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {
            title: 'sub-ordinates',
            exclude: [
              'id',
              'password',
              'created_at',
              'updated_at',
              'role_id',
              'forget_hash',
              'earnings_id',
            ],
          }),
        },
      },
    })
    subOrdinate: Omit<Admin, 'id'>,
  ): Promise<Admin> {
    const user = await this.adminRepository.findOne({
      where: {email_id: subOrdinate.email_id},
    });
    if (user) {
      throw new HttpErrors.UnprocessableEntity('User email already exist');
    }

    //Sub ordinates roles
    subOrdinate.role_id = ROLES.SUB_ORDINATES;

    return this.adminRepository.create(subOrdinate);
  }

  @get('/cp/v1/sub-ordinates')
  @response(200, {
    description: 'sub-ordinates',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin, {includeRelations: true}),
      },
    },
  })
  async find(): Promise<Admin[]> {
    return this.adminRepository.find({
      where: {role_id: ROLES.SUB_ORDINATES},
      fields: {
        password: false,
        created_at: false,
        updated_at: false,
        forget_hash: false,
      },
    });
  }

  @get('/cp/v1/sub-ordinates/{id}')
  @response(200, {
    description: 'sub-ordinates',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Object> {
    const user = await this.adminRepository.findById(id, {
      fields: {password: false, created_at: false, updated_at: false},
    });

    const earnings = await this.earningsRepository.getEarnings(id, 'DAY');
    return {...user, earnings};
  }

  @patch('/cp/v1/sub-ordinates/{id}')
  @response(204, {
    description: 'sub-ordinates',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {
            partial: true,
            exclude: [
              'id',
              'password',
              'created_at',
              'updated_at',
              'role_id',
              'forget_hash',
              'earnings_id',
            ],
          }),
        },
      },
    })
    subOrdinate: Admin,
  ): Promise<void> {
    await this.adminRepository.updateById(id, subOrdinate);
  }

  @del('/cp/v1/sub-ordinates/{id}')
  @response(204, {
    description: 'sub-ordinates',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.adminRepository.deleteById(id);
  }
}
