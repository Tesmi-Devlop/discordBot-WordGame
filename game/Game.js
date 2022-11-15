export default class Game {
  static #freeId = 0;
  static games = {};
  words = [];

  /**
   * @param {number} serverId
   * @param {User} owner
   */
  constructor(serverId, owner) {
    this.serverId = serverId;
    this.playerOwner = owner;
    this.players = [];
    this.players.push(owner);
  }

  joinPlayer(player) {
    return new Promise((resolve, reject) => {
      if (this.findPlayer(player.id) !== -1) return reject('Вы уже находитесь в этой игре');
      if (Game.findPlayer(player.id) !== -1) return reject('Вы уже находитесь в другой игре');
      this.players.push(player);

      resolve();
    })
  }

  findPlayer(playerId) {
    return this.players.findIndex((value) => value.id === playerId);
  }

  /**
   * @param {User} player
   * @param {User} playerOnKick
   */
  kickPlayer(player, playerOnKick) {
    return new Promise((resolve, reject) => {
      if (this.playerOwner.id !== player.id) return reject('Вы не владелец игры');
      if (this.findPlayer(playerOnKick.id) === undefined) reject('Данного игрока нет в игре');
      if (this.playerOwner.id === playerOnKick.id) reject('Вы не можете кикнуть сами себя');

      const indexPlayer = this.findPlayer(playerOnKick.id);

      this.players.splice(indexPlayer, 1);

      resolve();
    })
  }

  static findPlayer(playerId) {
    const keys = Object.keys(this.games);

    for (let i = 0; i < keys.length; i++) {
      const games = this.games[keys[i]];

      for (let ii = 0; ii < games.length; ii++) {
        const playerIndex = games[ii].findPlayer(playerId);
        if (playerIndex !== -1) return games[ii][playerIndex];
      }
    }

    return -1;
  }

  static #addGame(serverId, game) {
    if (this.games[serverId] === undefined) {
      this.games[serverId] = [];
    }

    this.games[serverId].push(game);
    game.id = this.#freeId;
    this.#freeId += 1;
  }

  /**
   * @param {number} serverId
   * @param {User} owner
   */
  static create(serverId, owner) {
    return new Promise((resolve, reject) => {
      if (this.findPlayer(owner.id) !== -1) reject('Вы уже находитесь в другой игре');

      const instance = new Game(serverId, owner);
      this.#addGame(serverId, instance);

      resolve(instance);
    })
  }
}