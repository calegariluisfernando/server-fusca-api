import ServerSetup from "./server";

(async (): Promise<void> => {

    const server = new ServerSetup();
    await server.init();

    server.start();
})();
