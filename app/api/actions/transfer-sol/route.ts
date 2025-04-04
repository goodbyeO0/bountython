import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
  ActionError,
} from "@solana/actions";

import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmRawTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";
import {
  validatedQueryParams,
  setToPubkey,
  setAmount,
  setContactInfo,
  setAccount,
  setMostRecentTransactionHash,
  getToPubkey,
} from "./utils";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    console.log(`requestUrl: ${requestUrl}`);
    const {
      toPubkey: newToPubkey,
      amount: newAmount,
      contactInfo: newContactInfo,
    } = validatedQueryParams(requestUrl);
    setToPubkey(newToPubkey);
    setAmount(newAmount);
    setContactInfo(newContactInfo);
    console.log(
      `validatedQueryParams: ${JSON.stringify(
        validatedQueryParams(requestUrl)
      )}`
    );

    const baseHref = new URL(
      `/api/actions/transfer-sol?to=${newToPubkey.toBase58()}`,
      requestUrl.origin
    ).toString();
    console.log(baseHref);

    const payload: ActionGetResponse = {
      type: "action",
      title: "Marvel Endgame",
      icon: new URL("/gambar_izhan.jpg", requestUrl.origin).toString(),
      description:
        "\nThe epic conclusion to the Avengers saga! Witness the final battle that will decide the fate of the universe. Relive the action-packed moments that brought heroes together like never before. \n\n\n\nBuy your ticket now for just 0.1 SOL.",
      label: "Transfer",
      links: {
        actions: [
          {
            label: "Buy Ticket",
            href: `${baseHref}&amount=${"0.1"}&contactInfo={contactInfo}`,
            parameters: [
              {
                name: "contactInfo",
                label: "email",
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  let currentToPubkey: PublicKey | null = null;
  try {
    const requestUrl = new URL(req.url);
    console.log(`requestUrl: ${requestUrl}`);
    const {
      amount: newAmount,
      toPubkey: newToPubkey,
      contactInfo: newContactInfo,
    } = validatedQueryParams(requestUrl);
    currentToPubkey = newToPubkey;
    setToPubkey(newToPubkey);
    setAmount(newAmount);
    setContactInfo(newContactInfo);

    console.log(newContactInfo);

    const body: ActionPostRequest = await req.json();
    console.log(`body: ${JSON.stringify(body)}`);

    try {
      const account = new PublicKey(body.account);
      setAccount(account);
      console.log(`body.account: ${account}`);
    } catch (err) {
      throw 'Invalid "account" provided';
    }

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("devnet")
    );

    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0
    );
    if (newAmount * LAMPORTS_PER_SOL < minimumBalance) {
      throw `account may not be rent exempt: ${newToPubkey.toBase58()}`;
    }

    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(body.account),
      toPubkey: newToPubkey,
      lamports: newAmount * LAMPORTS_PER_SOL,
    });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    console.log(
      `getLatestBlockhash: ${JSON.stringify(
        await connection.getLatestBlockhash()
      )}`
    );

    const transaction = new Transaction({
      feePayer: new PublicKey(body.account),
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${newAmount} SOL to ${newToPubkey.toBase58()}`,
      },
    });

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  } finally {
    if (currentToPubkey) {
      const connection = new Connection(
        process.env.SOLANA_RPC! || clusterApiUrl("devnet")
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const confirmedSignatures = await connection.getSignaturesForAddress(
        currentToPubkey,
        { limit: 1 }
      );
      console.log(
        `Confirmed signatures for ${currentToPubkey.toBase58()}: ${JSON.stringify(
          confirmedSignatures
        )}`
      );

      if (confirmedSignatures.length > 0) {
        setMostRecentTransactionHash(confirmedSignatures[0].signature);
        console.log(
          `Most recent transaction hash: ${confirmedSignatures[0].signature}`
        );
      }

      console.log("hello");
    }
  }
};
