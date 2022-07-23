import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Admin} from '../../models';
import {AdminRepository} from '../../repositories';

export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
    @inject('authUser')
    public authUser: any,
  ) {
    if (!this.authUser.pro_id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @post('/cp/v1/admins')
  @response(200, {
    description: 'Admin model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {
            title: 'NewAdmin',
            exclude: ['id', 'password', 'created_at', 'updated_at'],
          }),
        },
      },
    })
    admin: Omit<Admin, 'id'>,
  ): Promise<Admin> {
    const user = await this.adminRepository.findOne({
      where: {email_id: admin.email_id},
    });
    if (user) {
      throw new HttpErrors.UnprocessableEntity('User email already exist');
    }
    return this.adminRepository.create(admin);
  }

  @get('/cp/v1/admins/{id}')
  @response(200, {
    description: 'Admin model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Admin> {
    return this.adminRepository.findById(id, {
      fields: {password: false, created_at: false, updated_at: false},
    });
  }

  @patch('/cp/v1/admins/{id}')
  @response(204, {
    description: 'Admin PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {
            partial: true,
            exclude: ['id', 'password', 'created_at', 'updated_at'],
          }),
        },
      },
    })
    admin: Admin,
  ): Promise<void> {
    await this.adminRepository.updateById(id, admin);
  }

  @del('/cp/v1/admins/{id}')
  @response(204, {
    description: 'Admin DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.adminRepository.deleteById(id);
  }
}
