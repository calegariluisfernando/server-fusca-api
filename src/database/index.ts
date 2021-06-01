import { Connection } from "typeorm";


const createConnectionMySQL = async (): Promise<Connection> => null;

const createConnectionMongo = async (): Promise<Connection> => null;

export { createConnectionMySQL, createConnectionMongo }