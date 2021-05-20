import express, { NextFunction, Request, Response } from "express";
import 'express-async-errors';
import 'reflect-metadata';
import cors from 'cors';
import createConnection from './database';
import { AppError } from './error/AppError';
import { middleware } from './middlewares';
import { router } from './routes';
import { TokenHandler } from  './utils/TokenHandler';
import connectMongo from "./database/mongo";


connectMongo();
createConnection();
const app = express();

// Antes de Subir Aplicação Verificar se tem Tokens no Mongo
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

    const listID = blackListToken.map(item => item['idToken']);
    activeTokens = activeTokens.filter(item => !listID.includes(item['idToken']));

    activeTokens = activeTokens.filter(item => {

        let checkedToken = TokenHandler.verify(item['token']);
        return checkedToken.status
    });

    

}, timeCheckActiveTokens);


// ******************************************** //
//                                              //    
//      Removendo Tokens Inválidos da           //
//        da Black List de Tokens               //
//                                              //
// ******************************************** //
const timeCheckBlacklistTokens = 1000 * 60 * .1;
setInterval(() => {

    console.log('Removendo Tokens Inválidos: Black List Tokens', new Date().toLocaleTimeString());
    console.log('Quantidade Tokens Black List:', blackListToken.length);

    blackListToken = blackListToken.filter(item => {

        let checkedToken = TokenHandler.verify(item['token']);
        return checkedToken.status
    });

}, timeCheckBlacklistTokens);

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

export { app, activeTokens, blackListToken };
