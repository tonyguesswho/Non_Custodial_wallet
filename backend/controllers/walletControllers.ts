import { Request, Response } from "express";
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';
import { payments, Psbt, networks } from "bitcoinjs-lib";
import { validationResult } from 'express-validator';
import {createAddressBatch, changeAddressBatch} from "../helpers/bitcoinlib";

import * as ecc from 'tiny-secp256k1';

export interface Address extends payments.Payment {
    derivationPath: string;
    masterFingerprint: Buffer;
    type?: "used" | "unused";
  }


const bip32 = BIP32Factory(ecc);

const derivationPath = "m/84'/0'/0'";


/**
   * @export
   * @class WalletController
   *  @description Performs wallet operation
   */
class WalletController {
  /**
    * @description -This method generates a mnemonic
    * @param {object} req - The request payload
    * @param {object} res - The response payload sent back from the method
    * @returns {object} - mnemonic
    */
  static async generateMnenomic(req: Request, res:Response) {
    const mnemonic = generateMnemonic(256);
    try {
      return res.status(200).json({
        message: "mnemonic generated Successfully",
        data: mnemonic
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

    /**
    * @description -This method generates MasterKeys
    * @param {object} req - The request payload
    * @param {object} res - The response payload sent back from the method
    * @returns {object} - MasterKeys
    */
  static async generateMasterKeys(req: Request, res:Response) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        const {mnemonic} = req.body;
        const seed = await mnemonicToSeed(mnemonic);
        const privateKey = bip32.fromSeed(seed, networks.testnet);
        const xprv = privateKey.toBase58();

        const xpub = privateKey.derivePath(derivationPath).neutered().toBase58();
        return res.status(200).json({
            message: "Successfully generated master keys",
            data: {
                xprv,
                xpub,
            }
          });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async generateAddress(req: Request, res:Response) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }


        // get xpub
        const {xpub} = req.body;
        const addressType: string | unknown = req.query.type;

        const node: BIP32Interface = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        const currentAddressBatch: Address[] = createAddressBatch(xpub, node, addressType);

        const currentChangeAddressBatch: Address[] = changeAddressBatch(xpub, node, addressType);

        const data = {
            address: currentAddressBatch,
            changeAddress: currentChangeAddressBatch,
        };
        return res.status(200).json({
            message:  'Successfully generated address',
            data
          });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }



}

export default WalletController;
