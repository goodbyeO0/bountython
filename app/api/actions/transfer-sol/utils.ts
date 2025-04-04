import { PublicKey } from "@solana/web3.js";
import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";

let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
let amount: number = DEFAULT_SOL_AMOUNT;
let contactInfo: string = "";
let account: PublicKey | null = null;
let mostRecentTransactionHash: string | null = null;

export const getToPubkey = () => toPubkey;
export const getAmount = () => amount;
export const getContactInfo = () => contactInfo;
export const getAccount = () => account;
export const getMostRecentTransactionHash = () => mostRecentTransactionHash;

export const setToPubkey = (newToPubkey: PublicKey) => {
  toPubkey = newToPubkey;
};

export const setAmount = (newAmount: number) => {
  amount = newAmount;
};

export const setContactInfo = (newContactInfo: string) => {
  contactInfo = newContactInfo;
};

export const setAccount = (newAccount: PublicKey) => {
  account = newAccount;
};

export const setMostRecentTransactionHash = (newHash: string) => {
  mostRecentTransactionHash = newHash;
};

export const validatedQueryParams = (requestUrl: URL) => {
  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount")!);
    }

    if (amount <= 0) throw "amount is too small";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  try {
    if (requestUrl.searchParams.get("contactInfo")) {
      contactInfo = requestUrl.searchParams.get("contactInfo")!;
    }
  } catch (err) {
    throw "Invalid input query parameter: contactInfo";
  }

  return {
    amount,
    toPubkey,
    contactInfo,
  };
};
