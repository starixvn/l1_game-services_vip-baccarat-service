import { Core } from "sc-game-base";

export default class VipBaccaratSocketRouter extends Core.Routers.BaseSocketRouter {
    init(socketClient) {
        super.init(socketClient);

        this.socketClient.on("ping", (callback) => {
            callback();
        });
    }
}
