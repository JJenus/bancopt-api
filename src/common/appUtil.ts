import { UserUpdateAttributes } from "../api/users/users.model";
import nodeMailer from "nodemailer";
import { welcomeEmail } from "./welcomeEmail";
import { passwordEmail } from "./changePasswordEmail";
import { otpEmail } from "./otpEmail";

export const AppName = "Bancopt";
const noReply = "noreply@bancopt.com";
const smtpHost = "smtp.zoho.com";
const smtpPort = 465; //465; 587 // Use the appropriate port for your SMTP server
// Sender's email credentials
const senderPassword = "@Bancopt1358"; //noreply@bancopt.com

const sendEmail = async (
	to: string,
	message: string | null,
	subject: string,
	plainText?: string
) => {
	const transporter = nodeMailer.createTransport({
		host: smtpHost,
		port: smtpPort,
		secure: true,
		auth: {
			// TODO: replace `user` and `pass` values from <https://forwardemail.net>
			user: noReply,
			pass: senderPassword,
		},
	});

	try {
		console.log("Sending mail");
		const info = await transporter.sendMail({
			from: `${AppName} <${noReply}>`, // sender address
			to: to!, // list of receivers
			subject: subject, // Subject line
			text: plainText || AppName, // plain text body
			html: message || AppName, // html body
		});

		console.log("Message sent: %s", info.messageId);
	} catch (error) {
		console.log("EMAIL ERROR: ", error);
	}
};

export const sendWelcomeEmail = async (user: UserUpdateAttributes) => {
	const message = welcomeEmail
		.replace("{{name}}", user.name!)
		.replace("{{token}}", user.id!);

	await sendEmail(
		user.email!,
		message,
		"Welcome to " + AppName,
		`Welcome to ${AppName}. Click the link to verify your email.`
	);
};

export const sendPasswordEmail = async (user: UserUpdateAttributes) => {
	const message = passwordEmail.replace("{{token}}", user.id!);

	await sendEmail(
		user.email!,
		message,
		"Password Reset",
		"Forgot your password?"
	);
};

export const sendOTPEmail = async (user: UserUpdateAttributes, token: number) => {
	const message = otpEmail
		.replace("{{ name }}", user.name!)
		.replace("{{ token }}", `${token}`);

	await sendEmail(
		user.email!,
		message,
		"Login OTP",
		`${AppName} OTP ${token}. Expires in 15 minutes.`
	);
};

export const isEmail = (val: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(val);
};

export const generateCode = (len: number) => {
	if (typeof len !== "number" || len <= 0 || !Number.isInteger(len)) {
		throw new Error("The length should be a positive integer.");
	}

	const min = Math.pow(10, len - 1);
	const max = Math.pow(10, len) - 1;

	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const JwtSignToken = "xipayUan5640$sdr";
