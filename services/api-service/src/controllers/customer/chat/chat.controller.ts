import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  param,
  get,
  requestBody,
  response,
  HttpErrors,
  post,
} from '@loopback/rest';
import {
  ProfileChatsRepository,
  ProfileMessagesRepository,
  ProfilesRepository,
} from '../../../repositories';
import {Chatengine} from '../../../services/chatengine.service';
import {AuthUser} from '../../../utils';
const chatengine = new Chatengine();
export class ProfileChatsController {
  constructor(
    @repository(ProfileChatsRepository)
    public profileChatsRepository: ProfileChatsRepository,
    @repository(ProfileMessagesRepository)
    public profileMessagesRepository: ProfileMessagesRepository,
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/v1/users/chats/{receiver_id}')
  async findById(
    @param.path.number('receiver_id') receiver_id: number,
  ): Promise<Object[]> {
    const sender_id = this.authUser.id;
    const chats = await this.profileChatsRepository.findOne({
      where: {
        sender_id: {inq: [sender_id, receiver_id]},
        receiver_id: {inq: [sender_id, receiver_id]},
      },
    });

    const message = await this.profileMessagesRepository.find({
      where: {chat_id: chats!.id},
    });

    return message;
  }

  @get('/v1/users/chats')
  async chatUsers(): Promise<Object[]> {
    const chats = await this.profileChatsRepository.find({
      where: {
        or: [{sender_id: this.authUser.id}, {receiver_id: this.authUser.id}],
      },
    });

    let profileIds: number[] = [];
    if (chats.length) {
      chats.map(x => {
        x.receiver_id !== this.authUser.id ? profileIds.push(x.receiver_id) : 0;
        x.sender_id !== this.authUser.id ? profileIds.push(x.sender_id) : 0;
      });
    } else {
      return [];
    }
    const profiles = await this.profilesRepository.find({
      where: {id: {inq: profileIds}},
      fields: {id: true, name: true},
    });

    return profiles;
  }

  @post('/v1/users/chats/{receiver_id}')
  @response(204, {
    description: 'Start new chat',
  })
  async create(
    @param.path.number('receiver_id') receiver_id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              message: {type: 'string'},
            },
            required: ['message'],
          },
        },
      },
    })
    chat: {message: string},
  ): Promise<Object> {
    // create new or update chat
    const sender_id = this.authUser.id;
    let chatId: number = 0;
    const alreayPaired = await this.profileChatsRepository.findOne({
      where: {
        sender_id: {inq: [sender_id, receiver_id]},
        receiver_id: {inq: [sender_id, receiver_id]},
      },
    });
    chatId = alreayPaired && alreayPaired.id ? alreayPaired.id : 0;

    if (!alreayPaired) {
      const createPair = await this.profileChatsRepository.create({
        sender_id,
        receiver_id,
      });
      chatId = createPair.id || 0;
    }

    // create chat
    const conversation = await this.profileMessagesRepository.create({
      chat_id: chatId,
      profile_id: sender_id,
      message: chat.message,
    });

    return {success: true};
  }

  @post('/v1/users/chats/start')
  @response(204, {
    description: 'Start new chat',
  })
  async startChat(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              reciverId: {type: 'number'},
            },
            required: ['reciverId'],
          },
        },
      },
    })
    chat: {
      reciverId: number;
    },
  ): Promise<Object> {
    const reciver = await this.profilesRepository.findById(chat.reciverId);
    const sender = await this.profilesRepository.findById(this.authUser.id);

    const result = await chatengine.startChart(
      sender.profile_id!,
      reciver.profile_id!,
    );
    if (result.status === 'ERROR') {
      throw new HttpErrors.UnprocessableEntity(result.message);
    }

    return {success: true};
  }

  @get('/v1/users/chats/token')
  async user(): Promise<Object> {
    const user = await this.profilesRepository.findById(this.authUser.id);
    const data = {
      username: user.profile_id!.toLowerCase(),
      secret: `pellifix_${user.profile_id}`,
    };
    return {token: Buffer.from(JSON.stringify(data)).toString('base64')};
  }
}
