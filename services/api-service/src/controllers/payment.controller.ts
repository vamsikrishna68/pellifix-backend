import {inject} from '@loopback/core';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {AuthUser} from '../utils';
import {PaymentHistoryRepository} from '../repositories';
import {repository} from '@loopback/repository';
const Razorpay = require('razorpay');
interface RayzorFields {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture: boolean;
  notes: object;
}

interface PaymentComplete {
  profile_id: number;
  payment_info: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
}
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});

export class RazorpayController {
  constructor(
    @inject('authUser')
    public authUser: AuthUser,
    @repository(PaymentHistoryRepository)
    public paymentHistoryRepository: PaymentHistoryRepository,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }
  /**
   * Create a razorpay place
   * @param data
   */
  @post('/v1/razor/payment', {
    responses: {
      '200': {},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              amount: {type: 'number'},
              receipt: {type: 'string'},
              notes: {type: 'object'},
            },
            required: ['amount', 'receipt'],
          },
        },
      },
    })
    data: RayzorFields,
  ): Promise<object> {
    const options = {
      amount: data.amount * 100,
      currency: 'INR',
      receipt: data.receipt,
      payment_capture: true,
      notes: data.notes,
    };

    const response = await razorpay.orders.create(options);
    return {
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    };
  }

  /**
   * Capture paument success payload
   * @param data
   */
  @post('/v1/razor/payment/complete', {
    responses: {
      '200': {},
    },
  })
  async paymentComplete(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              profile_id: {type: 'number'},
              payment_info: {
                type: 'object',
                properties: {
                  razorpay_payment_id: {type: 'string'},
                  razorpay_order_id: {type: 'string'},
                  razorpay_signature: {type: 'string'},
                },
              },
            },
            required: ['profile_id', 'payment_info'],
          },
        },
      },
    })
    data: PaymentComplete,
  ): Promise<void> {
    await this.paymentHistoryRepository.create(data);
  }
}
