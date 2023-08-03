import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function Captcha(props) {
    const setToken = props.setToken;
    const captchaRef = props.captchaRef;

    return (
        <HCaptcha
            sitekey={process.env.HCAPTCHA_SITEKEY}
            onVerify={(token)=>{
                setToken(token)
            }}
            onExpire={() => {
                setToken('')
            }}
            onError={(err) => {
                setToken('');
                console.error("captcha: ", err);
            }}
            ref={captchaRef}
        />
    )
  }