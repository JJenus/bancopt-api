import Account, { updateAccount } from "./account.model";
import AccountStatus from "./account.status";
import crypto from "crypto";

function generateAccountNumber() {
	return (
		crypto.randomBytes(5).readUInt32LE(0) +
		crypto.randomBytes(5).readUInt32LE(0)
	);
}

export const createAccount = async (
	userId: string,
	currencyId: string
): Promise<Account> => {
	try {
		let accountNumber = generateAccountNumber();

		while (
			(await Account.findOne({
				where: { accountNumber: accountNumber },
			})) !== null
		) {
			accountNumber = generateAccountNumber();
		}
		const account = new Account({
			userId: userId,
			currencyId: currencyId,
			amount: 0,
			accountNumber: accountNumber,
			accountLevel: 1,
			status: AccountStatus.ACTIVE,
		});

		const newAccount = await account.save();

		return newAccount;
	} catch (error) {
		console.log(error);
		throw new Error("Unable to create account");
	}
};

export const updateUserAccount = async (
	uAccount: updateAccount
): Promise<Account> => {
	try {
		const eAccount = await Account.findByPk(uAccount.id);

		if (!eAccount) {
			throw new Error("Invalid account");
		}

		eAccount.setAttributes(uAccount);

		return await eAccount.save();
	} catch (error) {
		console.log(error);
		throw new Error("Unable to update account");
	}
};

export const updateBalance = async (update: updateAccount) => {
	let account: Account | null;
	try {
		account = await Account.findOne({ where: { userId: update.userId } });
		if (account === null) throw new Error();
	} catch (error) {
		throw new Error("Unauthorized balance update");
	}

	try {
		if (!update.amount) throw new Error();
		const balance = account.amount + update.amount;

		account.setDataValue("amount", balance);
		await account.save();
	} catch (error) {
		throw new Error("Unable to update balance");
	}
};

export const updateCurrency = async (update: updateAccount) => {
	let account: Account | null;
	try {
		account = await Account.findOne({ where: { userId: update.userId } });
		if (account === null) throw new Error();
	} catch (error) {
		throw new Error("Unauthorized currency update");
	}

	try {
		if (!update.currencyId) {
			throw new Error();
		}

		account.setDataValue("currencyId", update.currencyId);
		await account.save();
	} catch (error) {
		throw new Error("Unable to update currency");
	}
};

export const findUserAccount = async (
	id: string | number
): Promise<Account> => {
	try {
		const account = await Account.findOne({ where: { userId: id } });
		if (account === null) throw new Error("Account not found");
		return account;
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("not found"))
				throw new Error(error.message);
		}
		throw new Error("Unauthorized currency update");
	}
};

export const findUserByAccountNumber = async (id: number): Promise<Account> => {
	try {
		const account = await Account.findOne({ where: { accountNumber: id } });
		if (account === null) throw new Error("Account not found");
		return account;
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("not found"))
				throw new Error(error.message);
		}
		throw new Error("Unauthorized currency update");
	}
};
