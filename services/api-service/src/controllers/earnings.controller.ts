import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {Earnings} from '../models';
import {EarningsRepository} from '../repositories';

export class EarningsController {
  constructor(
    @repository(EarningsRepository)
    public earningsRepository: EarningsRepository,
  ) {}

  @get('/earnings')
  async find(
    @param.filter(Earnings) filter?: Filter<Earnings>,
  ): Promise<Earnings[]> {
    // var now = new Date();
    // var daysOfYear = [];
    // for (var d = new Date(2021, 0, 1); d <= now; d.setDate(d.getDate() + 1)) {
    //   console.log(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
    //   daysOfYear.push({
    //     admin_id: 1,
    //     date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
    //     amount: d.getDate() * (d.getMonth() + 1),
    //   });
    // }

    return this.earningsRepository.find(filter);
  }

  @patch('/earnings')
  @response(200, {
    description: 'Earnings PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Earnings, {partial: true}),
        },
      },
    })
    earnings: Earnings,
    @param.where(Earnings) where?: Where<Earnings>,
  ): Promise<Count> {
    return this.earningsRepository.updateAll(earnings, where);
  }

  @get('/earnings/{id}')
  @response(200, {
    description: 'Earnings model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Earnings, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Earnings, {exclude: 'where'})
    filter?: FilterExcludingWhere<Earnings>,
  ): Promise<Earnings> {
    return this.earningsRepository.findById(id, filter);
  }

  @patch('/earnings/{id}')
  @response(204, {
    description: 'Earnings PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Earnings, {partial: true}),
        },
      },
    })
    earnings: Earnings,
  ): Promise<void> {
    await this.earningsRepository.updateById(id, earnings);
  }
}
