import express, { Router } from 'express';
import WalletController from "../controllers/walletControllers";
import {validategenerateKeys} from "../utils/validator/wallet";


const router: Router = express.Router();

router.get('/mnenomic', WalletController.generateMnenomic);

router.post('/privatekey', validategenerateKeys,  WalletController.generateMasterKeys);

router.post('/getaddress', WalletController.generateAddress);

export default router;