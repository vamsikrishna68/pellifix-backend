import twilio from 'twilio';
import {VerificationInstance} from 'twilio/lib/rest/verify/v2/service/verification';
import {VerificationCheckInstance} from 'twilio/lib/rest/verify/v2/service/verificationCheck';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_MESSAGE_SERVICE_SID!;

const client = twilio(accountSid, authToken);

/**
 * Send OTP sms
 * @param to is monile number '+9198********'
 * @returns
 */
export const sendOtpSMS = async (
  to: string,
): Promise<VerificationInstance | undefined> => {
  try {
    return client.verify.v2
      .services(serviceId)
      .verifications.create({to, channel: 'sms'});
  } catch (error) {
    console.log(error);
  }
};

/**
 * Verify OTP
 * @param to is monile number '+9198********'
 * @param code otp
 * @returns
 */
export const verifyOtpSMS = async (
  to: string,
  code: string,
): Promise<VerificationCheckInstance | undefined> => {
  try {
    return client.verify.v2
      .services(serviceId)
      .verificationChecks.create({to, code});
  } catch (error) {
    console.log(error);
  }
};
