import {get, response} from '@loopback/rest';

export class HealthCheck {
  constructor() {}

  @get('/v1/health-check')
  @response(200, {
    description: 'Health check',
    content: {
      'application/json': {
        schema: {
          properties: {
            name: {type: 'string'},
            message: {type: 'string'},
          },
        },
      },
    },
  })
  async healthCheck(): Promise<Object> {
    return {
      name: 'Matrimony',
      message: 'Now API server is running',
    };
  }
}
