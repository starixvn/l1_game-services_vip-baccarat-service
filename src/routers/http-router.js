import { Table } from "sc-game-base";

export default class HttpRouter extends Table.Routers.TableHttpRouter {

    mapRealUsers(players) {
        const testUsers = [];
        const realUsers = [];

        players.forEach((player) => {
            if (player && player.session && player.socketClient && player.socketClient.connected && this.gameData.players[player.UID]) {
                const user = {
                    name: player.session.playerName,
                    id: player.session.playerId,
                    currency: player.session.currencyName,
                    character: player.session.characterName,
                    system: player.session.system,
                    operatorId: player.session.operatorId,
                    partnerId: player.session.operatorId,
                };

                if (player.session.isTestCurrency) {
                    testUsers.push(user);
                } else {
                    realUsers.push(user);
                }
            }
        });

        return { testUsers, realUsers };
    }
}
