import { Core } from "sc-game-base";

export default class VipBaccaratSocketRouter extends Core.Routers.BaseSocketRouter {
    constructor({
        definition,
        gameData,
        userSignInConsumer,
        inGameConsumer,
        placeBetConsumer,
        userDisconnectConsumer,
        userSignInPublisher,
        historyQuery,
        logService,
        playGamePermissionValidator,
        rtpQuery,
        roundQuery,
    }) {
        super({
            definition,
            gameData,
            userSignInConsumer,
            inGameConsumer,
            placeBetConsumer,
            userDisconnectConsumer,
            userSignInPublisher,
            historyQuery,
            logService,
            playGamePermissionValidator,
        });

        this.rtpQuery = rtpQuery;
        this.roundQuery = roundQuery;
    }

    init(socketClient) {
        super.init(socketClient);

        this.socketClient.on("ping", (ack) => {
            ack({ received: true });
        });

        this.socketClient.on("getLobbyData", this.getLobbyData.bind(this));
    }

    async getLobbyData() {
        try {
            if (!this.verify() || this.gameData.disabled) {
                return;
            }

            const rtp = await this.rtpQuery.getRTP(this.definition.id);

            const result = {
                totalOnlineUsers: Object.keys(this.gameData.players).length,
                roundHistory: await this.roundQuery.getList(this.definition.numberOfRoundHistory),
                remainingTime: this.gameData.remainingTime,
                rtp: rtp > 98 ? rtp : 98,
                betLimit: this.getUserBetLimit(),
            };

            this.socketClient.emit(this.definition.name, result);
        } catch (error) {
            this.logService.logError(error);
        }
    }

    getUserBetLimit() {
        const player = this.gameData.realPlayers[this.socketClient.id];

        const settings = this.gameData.currencyGroupGames.find((x) => x.groupId.toString() === player.session.currencyGroupId);
        const minBet = Math.max(player.profile.minBet, settings.minBet);
        const maxBet = Math.min(player.profile.maxBet, settings.maxBet);

        return { minBet, maxBet };
    }
}
