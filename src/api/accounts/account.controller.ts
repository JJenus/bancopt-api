import { NextFunction, Request, Response } from "express";
import * as accountService from "./account.service";
import * as Users from "../users/users.service";
import * as transactionService from "../transactions/transactions.service";

import Account, {
	AccountAttr,
	updateAccount,
	updateBalance as Balance,
} from "./account.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import User from "../users/users.model";
import { TransactionStatus, TransactionTypes } from "../transactions/transactions";
import { TransactionAttr } from "../transactions/transactions.model";

export async function findAccount(
	req: Request<ParamsWithId, Partial<Account>, null>,
	res: Response<Partial<Account> | null>,
	next: NextFunction
) {
	try {
		let user: Partial<Account> = await accountService.findUserAccount(
			req.params.id
		);

		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function updateBalance(
	req: Request<{}, Partial<Balance>, Balance>,
	res: Response<Account>,
	next: NextFunction
) {
	try {
		const user: User = await Users.findUserByEmail(req.body.email);
		const account: Account = await accountService.findUserAccount(user.id);

		account.amount = account.amount | 0;
		const depositAmount = req.body.amount;

		account.set("amount", depositAmount + account.amount);

		await account.save();

		const transactionData: TransactionAttr = {
			senderId: user.id,
			receiverId: user.id,
			amount: depositAmount,
			type: TransactionTypes.CREDIT,
			notes: 'Deposit transaction',
			status: TransactionStatus.COMPLETED
		  };
		  
		  // Parse and validate the object

		  await transactionService.createTransaction(transactionData);

		res.json(account);
	} catch (error) {
		next(error);
	}
}

export async function updateUserAccount(
	req: Request<{}, Partial<updateAccount>, updateAccount>,
	res: Response<Account>,
	next: NextFunction
) {
	try {
		const account: Account = await accountService.updateUserAccount(req.body);

		res.json(account);
	} catch (error) {
		next(error);
	}
}

export async function deleteAccount(
	req: Request<ParamsWithId, Partial<Account>, null>,
	res: Response<Partial<Account>>,
	next: NextFunction
) {}
