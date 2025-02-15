import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpStore = new Map();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
//clean up expired otps
setInterval(() => {
    const now = Date.now();
    otpStore.forEach((value, key) => {
        if(value.expiresAt < now){
            otpStore.delete(key);
        }
    });
},120 * 1000);

const sendOtp = async (req,res) => {
    const {email} = req.body;
    
    if(!email) return res.status(400).json({message: 'Email is required'});

    try {
        const existingOtpData = otpStore.get(email);
        if(existingOtpData) {
            otpStore.delete(email);
        }

        
        const otp = generateOtp();

       const msg = {
            to:email,
            from:process.env.SENDGRID_FROM_EMAIL,
            subject: 'Your OTP for Registration',
            text: `Your OTP for registration is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP for registration is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
        }

        await sgMail.send(msg);
        otpStore.set(email,{otp, expiresAt: Date.now() + 300000}); // 5 minutes expiration time
        res.status(200).json({message:"OTP sent successfully"});
    } catch (error) {
        console.error('Error sending OTP:', error.response?.body || error.message);
        res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }
}

const verifyOtp = async (req,res) => {
    const {email, otp} = req.body;
    if(!email || !otp) return res.status(400).json({message: 'Email and OTP are required'});

    const storedOtpData = otpStore.get(email);

    if(!storedOtpData) return res.status(400).json({message: 'No OTP found for this email.'});

    const {otp:storedOtp, expiresAt} = storedOtpData;

    if(Date.now() > expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({message: 'OTP has expired.'});
    }

    if(otp !== storedOtp) return res.status(400).json({message: 'Invalid otp plese enter correct otp'});

    otpStore.delete(email);

    res.status(200).json({message: "OTP verifyed successfully"});

}

const forgotPasswordOtp = async (req,res) => {
    const {email} = req.body;
    
    if(!email) return res.status(400).json({message: 'Email is required'});

    try {
        const existingOtpData = otpStore.get(email);
        if(existingOtpData) {
            otpStore.delete(email);
        }

        
        const otp = generateOtp();

       const msg = {
            to:email,
            from:process.env.SENDGRID_FROM_EMAIL,
            subject: 'Your OTP for Forgot Password',
            text: `Your OTP for Forgot Password is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP for Forgot Password is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
        }

        await sgMail.send(msg);
        otpStore.set(email,{otp, expiresAt: Date.now() + 300000}); // 5 minutes expiration time
        res.status(200).json({message:"OTP sent successfully"});
    } catch (error) {
        console.error('Error sending OTP:', error.response?.body || error.message);
        res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }
}


export {sendOtp,verifyOtp,forgotPasswordOtp};
