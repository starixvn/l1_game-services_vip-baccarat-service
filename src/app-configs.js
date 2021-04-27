export default {
    hostingPort: 8087,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l2-api.lumigame.com",
        authUrl: "http://l2-auth.lumigame.com",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        enabledApiLogs: true,
    },
    mainServerApiSettings: {
        url: "http://haproxy.lumigame.com:7001/main/api",
        auth: {
            url: "http://l2-auth.lumigame.com",
            id: "game-services",
            secret: "gameservices@20luminet&",
        },
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        useAuthenticate: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://localhost:27017",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "https://35743b14d49e40a5a1657f3b9f597f39@sentryuat.sabagame.com/210",
        logIdentifier: "vip-baccarat",
        env: "LOCAL",
    },
    authenticateSettings: {
        audiences: ["api", "admin-api"],
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    enableCorsWs: true,
    corsUrls: ["http://localhost:7456", "http://l2-games.lumigame.com", "http://l2-admin.lumigame.com", "http://localhost:7000"],
};
