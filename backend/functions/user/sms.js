/**
 * 发送短信验证码
 * 使用腾讯云短信服务
 */

const { Response, Validator, Logger, CodeManager } = require('../../common/utils');

// 腾讯云短信配置（需要配置环境变量）
const SMS_CONFIG = {
  secretId: process.env.TENCENT_SECRET_ID,
  secretKey: process.env.TENCENT_SECRET_KEY,
  appId: process.env.SMS_APP_ID,
  templateId: process.env.SMS_TEMPLATE_ID,
  sign: process.env.SMS_SIGN || '融智助手'
};

exports.main = async (event, context) => {
  const { phone, type = 'login' } = event;
  
  try {
    Logger.info('发送验证码请求', { phone, type });

    // 参数验证
    const validation = Validator.validate(
      { phone },
      {
        phone: { required: true, type: 'phone', message: '请输入正确的手机号' }
      }
    );

    if (!validation.valid) {
      return Response.error(400, validation.errors[0]);
    }

    // 检查发送频率限制（60秒内只能发送一次）
    const codeRecord = CodeManager.codes.get(phone);
    if (codeRecord && Date.now() < codeRecord.expiresAt - (4 * 60 * 1000)) {
      return Response.error(429, '验证码发送过于频繁，请稍后再试');
    }

    // 生成验证码
    const code = CodeManager.generate(phone);

    // 生产环境：调用腾讯云短信API发送
    // 开发环境：直接返回验证码用于测试
    if (process.env.NODE_ENV === 'production' && SMS_CONFIG.secretId) {
      try {
        const tencentcloud = require('tencentcloud-sdk-nodejs-sms');
        const SmsClient = tencentcloud.sms.v20210111.Client;

        const client = new SmsClient({
          credential: {
            secretId: SMS_CONFIG.secretId,
            secretKey: SMS_CONFIG.secretKey
          },
          region: 'ap-beijing'
        });

        const params = {
          PhoneNumberSet: [`+86${phone}`],
          SmsSdkAppId: SMS_CONFIG.appId,
          SignName: SMS_CONFIG.sign,
          TemplateId: SMS_CONFIG.templateId,
          TemplateParamSet: [code, '5'] // 验证码，有效期5分钟
        };

        await client.SendSms(params);
        Logger.info('短信发送成功', { phone });

      } catch (smsError) {
        Logger.error('短信发送失败', { phone, error: smsError.message });
        // 短信发送失败，删除验证码
        CodeManager.codes.delete(phone);
        return Response.error(1001, '短信发送失败，请稍后重试');
      }
    } else {
      // 开发环境：打印验证码
      Logger.info('开发环境验证码', { phone, code });
    }

    return Response.success({
      message: '验证码已发送',
      // 开发环境返回验证码，生产环境不返回
      ...(process.env.NODE_ENV !== 'production' ? { code } : {})
    }, '发送成功');

  } catch (error) {
    Logger.error('发送验证码异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
