import zod from "zod";
import User, { UserUpdateAttributes } from "../users/users.model";

export const Login = zod.object({
	email: zod.string().email(),
	password: zod.string(),
});

export type Login = zod.infer<typeof Login>;

export type OTP = {
	token: number,
	createdAt: Date,
	allowedTime: number
}

export type AuthToken = {
	userId: string;
	user: UserUpdateAttributes
	token: string;
	otp?: OTP
};
