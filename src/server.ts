// import { app } from "./app";
//
// app.listen(3333, () => console.log('Servidor rodando 3333'));

import * as core from 'express-serve-static-core';
import express from "express";
import cors from "cors";
import createConnection from "./database";
import {UpServerController} from "./controllers/server/UpServerController";
import {Token} from "./models/Token";
import {TokenHandler} from "./utils/TokenHandler";

export default class ServerSetup {

    private _port: number;
    private _app: core.Express;
    private _allowedOrigins: string[];


    constructor(port = 3333) {

        this._port = port;
        this._allowedOrigins = ['http://localhost:3000'];
    }

    get port(): number {

        return this._port;
    }

    get app(): core.Express {

        return this._app;
    }

    get allowedOrigins(): string[] {

        return this._allowedOrigins;
    }

    set app(value: core.Express) {

        this._app = value;
    }

    public async init(): Promise<void> {

        this.setupExpress();
        await this.setupDatabase();
        await this.setupActiveTokenList();
    }

    public start(): void {

        this.app.listen(this.port, () => console.log(`Servidor Rodando na porta: ${ this.port }`));
    }

    private setupExpress() {

        this.app = express();
        this.app.use(express.json());
        this.app.use(cors({ origin: this.allowedOrigins }));
    }

    private async setupDatabase(): Promise<void> {

        await createConnection();
    }

    private async setupActiveTokenList(): Promise<void> {

        const upServerController = new UpServerController();
        await upServerController.loadTokensDatabase();

        // ******************************************** //
        //                                              //
        //      Removendo Tokens Inválidos da           //
        //        da Lista de Tokens Ativos             //
        //                                              //
        // ******************************************** //
        const timeCheckList = 1000 * 60 * .1;
        setInterval(() => {

            console.log('Removendo Tokens Inválidos: Tokens Ativos', new Date().toLocaleTimeString());
            console.log('Quantidade Tokens Ativos:', activeTokens.length);

            activeTokens = activeTokens.filter((t: Token) => TokenHandler.verify(t.strToken).status);

        }, timeCheckList);

        // ******************************************** //
        //                                              //
        //      Removendo Tokens Inválidos da           //
        //        da BlackList de Tokens                //
        //                                              //
        // ******************************************** //
        setInterval(() => {

            console.log('Removendo Tokens Inválidos: Black List Tokens', new Date().toLocaleTimeString());
            console.log('Quantidade Tokens Black List:', blackListToken.length);

            blackListToken = blackListToken.filter((t: Token) => TokenHandler.verify(t.strToken).status);

        }, timeCheckList);
    }
};

var activeTokens    = [];
var blackListToken  = [];
export { activeTokens, blackListToken };