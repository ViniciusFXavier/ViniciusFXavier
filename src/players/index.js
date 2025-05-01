const { cartesianToIsometric, getCardinalDirection } = require('./../utils');
const roomModels = require('./../room/models');

const PlayerImager = require('./playerImager');
const { findPath } = require('./findPath');

class Players {
  constructor({ room, followers = [] } = {}) {
    this.followers = followers;
    this.model = roomModels[room];
    this.players = [];
    this.styles = [];
    this.svgElements = '<g id="players">';
    this.directions = ['n', 'e', 's', 'w'];
  }

  run() {
    this.generate();
    this.players.sort((a, b) => (a.zIndex > b.zIndex) ? 1 : (a.zIndex === b.zIndex ? 0 : -1));

    for (const { player } of this.players) {
      this.svgElements += player;
    }

    this.svgElements += '</g>';
    return {
      svgElements: this.svgElements,
      styles: this.styles
    };
  }

  getAllPossiblePositions() {
    const positions = [];

    for (let y = 0; y < this.model.length; y++) {
      for (let x = 0; x < this.model[y].length; x++) {
        if (this.model[y][x] === 1) {
          positions.push({ x, y });
        }
      }
    }

    return positions;
  }

  createPlayerDefinitions() {
    this.svgElements += '<defs>';

    // Create East/South player definition
    const playerES = new PlayerImager({ direction: 'e' }).run();
    this.svgElements += `
      <g id="playerES">${playerES}</g>
      <use id="playerE" xlink:href="#playerES" transform='translate(0 0) scale(1 1)' />
      <use id="playerS" xlink:href="#playerES" transform='translate(32 0) scale(-1 1)' />
    `;

    // Create North/West player definition
    const playerNW = new PlayerImager({ direction: 'n' }).run();
    this.svgElements += `
      <g id="playerNW">${playerNW}</g>
      <use id="playerN" xlink:href="#playerNW" transform='translate(0 0) scale(1 1)' />
      <use id="playerW" xlink:href="#playerNW" transform='translate(32 0) scale(-1 1)' />
    `;

    this.svgElements += '</defs>';
  }

  getRandomPosition(availablePositions) {
    const index = Math.floor(Math.random() * availablePositions.length);
    const position = availablePositions[index];
    availablePositions.splice(index, 1);
    return position;
  }

  generateAnimations(paths, startPos) {
    const animations = {
      zIndexFromPath: [],
      player: [],
      direction: []
    };
    const directions = ['N', 'W', 'E', 'S']

    let prevIso = cartesianToIsometric(startPos);
    let prevCartesian = startPos;

    let prevDir = directions[Math.floor(Math.random() * directions.length)];
    for (let index = 0; index < paths.length; index++) {
      const point = paths[index];
      const isoPoint = cartesianToIsometric(point);
      const dx = isoPoint.x - prevIso.x;
      const dy = isoPoint.y - prevIso.y;
      const dir = getCardinalDirection(prevCartesian, point) || prevDir;
      const animationTime = `${(index / 2)}s`;

      animations.zIndexFromPath.push({
        zIndex: point.x + point.y,
        enable: `<set attributeName="display" to="inline" begin="${animationTime}" dur="0.2s" fill="freeze"/>`,
        disable: `<set attributeName="display" to="none" begin="${animationTime}" dur="0.2s" fill="freeze"/>`
      });

      animations.direction.push({
        dir,
        enable: `<set attributeName="display" to="inline" begin="${animationTime}" dur="0.2s" fill="freeze"/>`,
        disable: `<set attributeName="display" to="none" begin="${animationTime}" dur="0.2s" fill="freeze"/>`
      });

      animations.player.push(`<animateTransform attributeName="transform" type="translate" from="0 0" to="${dx} ${dy}" begin="${animationTime}" dur="0.2s" fill="freeze" additive="sum"/>`);

      prevIso = isoPoint;
      prevCartesian = point;
      prevDir = dir;
    }

    return animations;
  }

  createPlayerElement(name, isoStartPosition, animations) {
    let player = `<g id="player-${name}" transform="translate(${isoStartPosition.x + 412} ${isoStartPosition.y + 12})">`;

    for (const direction of this.directions) {
      const d = direction.toUpperCase();
      player += `<use xlink:href="#player${d}">`;
      player += `<set attributeName="display" to="none" begin="0s" dur="0s" fill="freeze"/>`

      for (const { dir, enable, disable } of animations.direction) {
        player += (dir === d) ? enable : disable;
      }

      player += '</use>';
    }

    player += `
      <text class="disable-pointer-events" x="10" y="-10" text-anchor="middle" style="fill:rgb(0,0,0);font: 14px sans-serif;">${name}</text>
      ${animations.player.join('')}
    </g>`;

    return player;
  }

  createZIndexLayers(name, paths, animations) {
    const zIndices = [...new Set(paths.map(path => path.x + path.y))];

    for (const zIndex of zIndices) {
      let playerLayer = `<use xlink:href="#player-${name}">`;

      for (const { zIndex: newzIndex, enable, disable } of animations.zIndexFromPath) {
        playerLayer += (zIndex === newzIndex) ? enable : disable;
      }

      playerLayer += '</use>';
      this.players.push({ name, player: playerLayer, zIndex });
    }
  }

  generatePaths(availablePositions, maxNewPaths = 2, maxPauses = 2) {
    const positionsEqual = (a, b) => a.x === b.x && a.y === b.y;

    const existsIn = (arr, pos) => arr.some(p => positionsEqual(p, pos));

    const pathCount = Math.floor(Math.random() * maxNewPaths) + 1;

    const originalStart = this.getRandomPosition(availablePositions);
    let startPos = originalStart;

    const paths = [];

    for (let i = 0; i < pathCount; i++) {
      const startPauseCount = Math.floor(Math.random() * (maxPauses / 2)) + 1;
      for (let j = 0; j < startPauseCount; j++) {
        paths.push(startPos);
      }

      const endPos = this.getRandomPosition(availablePositions);
      const pathSegment = findPath(this.model, startPos, endPos);

      if (!pathSegment || pathSegment.length === 0) {
        if (!existsIn(availablePositions, endPos)) {
          availablePositions.push(endPos);
        }
        continue;
      }

      paths.push(...pathSegment);

      const lastPos = pathSegment[pathSegment.length - 1];
      if (
        !positionsEqual(startPos, lastPos) &&
        !positionsEqual(startPos, originalStart) &&
        !existsIn(availablePositions, startPos)
      ) {
        availablePositions.push(startPos);
      }

      const pauseCount = Math.floor(Math.random() * maxPauses) + 1;
      for (let j = 0; j < pauseCount; j++) {
        paths.push(lastPos);
      }

      startPos = lastPos;
    }

    return {
      startPos: originalStart,
      endPos: startPos,
      paths
    };
  }

  generate() {
    this.createPlayerDefinitions();
    const availablePositions = this.getAllPossiblePositions();

    for (const name of this.followers) {
      const { startPos, paths } = this.generatePaths(availablePositions, 10, 50);

      const animations = this.generateAnimations(paths, startPos);

      const isoStartPosition = cartesianToIsometric(startPos);
      this.svgElements += this.createPlayerElement(name, isoStartPosition, animations);
      this.createZIndexLayers(name, paths, animations);
    }
  }
}

module.exports = Players;