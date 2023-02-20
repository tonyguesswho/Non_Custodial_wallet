import BIP32Factory, { BIP32Interface } from 'bip32';
import { networks, payments } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';


export interface Address extends payments.Payment {
  derivationPath: string;
  masterFingerprint: Buffer;
  type?: "used" | "unused";
}



const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);


export const createAddressBatch = (xpub: string, root: BIP32Interface, adType: string | unknown): Address[] => {
    const addressBatch: Address[] = [];

    for (let i = 0; i < 10; i++) {
      const derivationPath = `0/${i}`;
      const currentChildPubkey = deriveChildPublicKey(xpub, derivationPath);
      const currentAddress = getAddressFromChildPubkey(currentChildPubkey, adType);

      addressBatch.push({
        ...currentAddress,
        derivationPath,
        masterFingerprint: root.fingerprint,
      });
    }

    return addressBatch;
  };

  export const deriveChildPublicKey = (
    xpub: string,
    derivationPath: string
  ): BIP32Interface => {
    const node = bip32.fromBase58(xpub, networks.testnet);
    const child = node.derivePath(derivationPath);
    return child;
  };


/// Generate P2PKH address and P2WPKH
export const getAddressFromChildPubkey = (
    child: BIP32Interface, type: string | unknown = 'p2pkh'
  ): payments.Payment => {
    let address: payments.Payment;

    if (type === 'p2wpkh') {
      address = payments.p2wpkh({
        pubkey: child.publicKey,
        network: networks.testnet,
      });

      return address;
    }
    address = payments.p2pkh({
      pubkey: child.publicKey,
      network: networks.testnet,
    });

    return address;
  };


  export const changeAddressBatch = (xpub: string, root: BIP32Interface, addressType: string | unknown): Address[] => {
    const addressBatch: Address[] = [];

    for (let i = 0; i < 10; i++) {
      const derivationPath = `1/${i}`;
      const currentChildPubkey = deriveChildPublicKey(xpub, derivationPath);
      const currentAddress = getAddressFromChildPubkey(currentChildPubkey, addressType);

      addressBatch.push({
        ...currentAddress,
        derivationPath,
        masterFingerprint: root.fingerprint,
      });
    }

    return addressBatch;
  };