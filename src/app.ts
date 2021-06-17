import express, { NextFunction, Request, Response } from "express";
import 'express-async-errors';
import 'reflect-metadata';
import cors from 'cors';
import createConnection from './database';
import { AppError } from './error/AppError';
import { middleware } from './middlewares';
import { router } from './routes';
import { TokenHandler } from  './utils/TokenHandler';
import { Token } from "./models/Token";
import { UpServerController } from "./controllers/server/UpServerController";

createConnection();
const app = express();

const allowedOrigins = ['http://localhost:3000'];
const options: cors.CorsOptions = {
    origin: allowedOrigins
};

app.use(cors(options))
app.use(express.json());
app.use(middleware);
app.use(router);

app.use((err: Error, request: Request,  response: Response, _next: NextFunction) => {

    if (err instanceof AppError) {

        return response.status(err.statusCode).json({

            message: err.message
        });
    }

    return response.status(500).json({

        status: 'Error',
        message: `Internal server error ${err.message}`
    });
});

// Antes de Subir Aplicação Verificar se tem Tokens no Banco
var activeTokens = [];
var blackListToken = [];

// ******************************************** //
//                                              //    
//      Removendo Tokens Inválidos da           //
//        da Lista de Tokens Ativos             //
//                                              //
// ******************************************** //
const timeCheckActiveTokens = 1000 * 60 * .1;
setInterval(() => {

    console.log('Removendo Tokens Inválidos: Tokens Ativos', new Date().toLocaleTimeString());
    console.log('Quantidade Tokens Ativos:', activeTokens.length);

    activeTokens = activeTokens.filter((t: Token) => TokenHandler.verify(t.strToken).status);

}, timeCheckActiveTokens);


// ******************************************** //
//                                              //    
//      Removendo Tokens Inválidos da           //
//        da BlackList de Tokens                //
//                                              //
// ******************************************** //
const timeCheckBlacklistTokens = 1000 * 60 * .1;
setInterval(() => {

    console.log('Removendo Tokens Inválidos: Black List Tokens', new Date().toLocaleTimeString());
    console.log('Quantidade Tokens Black List:', blackListToken.length);

    blackListToken = blackListToken.filter((t: Token) => TokenHandler.verify(t.strToken).status);

}, timeCheckBlacklistTokens);

export { app, activeTokens, blackListToken };
