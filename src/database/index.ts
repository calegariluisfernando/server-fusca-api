import { Connection, createConnection as createConnectionTypeORM, getConnectionOptions } from "typeorm";

const createConnection = async (): Promise<Connection> => {

    const defaultOptions = await getConnectionOptions();

    console.log("DefaultOptions:", defaultOptions);

    return await createConnectionTypeORM(

        Object.assign(defaultOptions, {

            database: process.env.NODE_ENV === 'test'
                ? "fuscaTest" : defaultOptions.database
        })
    );
};

export default createConnection;