import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Users} from '../../models';
import {UsersRepository} from '../../repositories';

export class CustomerController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) {}

  @post('/v1/customer/register')
  @response(200, {
    description: 'Users model instance',
    content: {
      'application/json': {
        schema: {
          properties: {
            name: {type: 'string'},
            dob: {type: 'string', format: 'date-time'},
            email: {type: 'string'},
            phone: {type: 'number'},
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              name: {type: 'string'},
              dob: {type: 'string', format: 'date-time'},
              email: {type: 'string'},
              phone: {type: 'number'},
            },
            required: ['name', 'dob', 'email', 'phone'],
          },
        },
      },
    })
    users: {
      name: string;
      dob: string;
      email: string;
      phone: string;
    },
  ): Promise<Users> {
    const {name, ...custoemr} = users;

    return this.usersRepository.create({...custoemr, first_name: name});
  }

  @get('/v1/customers')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Users) filter?: Filter<Users>): Promise<Users[]> {
    return this.usersRepository.find(filter);
  }

  @get('/v1/customers/{id}')
  @response(200, {
    description: 'Users model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Users, {exclude: 'where'})
    filter?: FilterExcludingWhere<Users>,
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }
}
