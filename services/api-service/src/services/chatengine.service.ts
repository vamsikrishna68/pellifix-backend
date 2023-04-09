import axios from 'axios';

interface CreateUserResponse {
  status: 'ERROR' | 'SUCCESS';
  message: string;
}
const PRIVATE_KEY = process.env.CHAT_PRIVATE_KEY;
const PROJECT_ID = process.env.CHAT_PROJECT_ID;
const perifix = 'pellifix';

export class Chatengine {
  private readonly baseUrl = 'https://api.chatengine.io';

  async createUser(
    username: string,
    profileId: string,
  ): Promise<CreateUserResponse> {
    const data = JSON.stringify({
      username: profileId.toLowerCase(),
      first_name: username,
      secret: `${perifix}_${profileId}`,
    });

    const headers = {
      'Private-Key': PRIVATE_KEY,
      'Content-Type': 'application/json',
    };

    try {
      const value = await axios.post(`${this.baseUrl}/users/`, data, {headers});
      console.log(value);
      return {
        status: 'SUCCESS',
        message: 'Successfully added',
      };
    } catch (error) {
      console.log(error);
      return {status: 'ERROR', message: 'Some error on user create'};
    }
  }

  async startChart(senderProfileId: string, reciverUsername: string) {
    const senderUsername = senderProfileId.toLowerCase();
    reciverUsername = reciverUsername.toLowerCase();

    const data = JSON.stringify({
      usernames: [reciverUsername],
      is_direct_chat: true,
    });

    const headers = {
      'Project-ID': PROJECT_ID,
      'User-Name': senderUsername,
      'User-Secret': `${perifix}_${senderProfileId}`,
      'Content-Type': 'application/json',
    };

    try {
      await axios.put(`${this.baseUrl}/chats/`, data, {headers});
      return {
        status: 'SUCCESS',
        message: 'Successfully added',
      };
    } catch (error) {
      console.log(error);
      return {status: 'ERROR', message: 'User not able to connect'};
    }
  }
}
