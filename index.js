const fs = require('fs');
const d3 = require('d3');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var IsoBlock = IsoBlock || {};

const dom = new JSDOM(`<!DOCTYPE html><body></body>`);

let body = d3.select(dom.window.document.querySelector('body'));
let svg = body.append('svg').attr('width', 800).attr('height', 800).attr('xmlns', 'http://www.w3.org/2000/svg');
let map = svg.append('g').attr('id', 'map');
let ground = map.append('g').attr('id', 'ground');
// ground.attr("transform", "translate(100, 100) rotate(45)");

const mapOptions = {
  tileSize: 64,
  tiles: [
    [[0]],
  ],
  colors: ['#373', '#fc7']
}

for (let y = 0; y < mapOptions.tiles.length; y++) {
  for (let x = 0; x < mapOptions.tiles[y].length; x++) {
    const tileValue = mapOptions.tiles[y][x];
    let tile = ground.append('g').attr('id', `tile(${y},${x})`);
    tile.append('rect')
      .attr('x', x * mapOptions.tileSize)
      .attr('y', y * mapOptions.tileSize)
      .attr('width', mapOptions.tileSize)
      .attr('height', mapOptions.tileSize)
      .style('fill', mapOptions.colors[tileValue[0]])
      .style('stroke-width', 0.1)
      .style('stroke', 'rgb(255,255,255)');

    tile.append('polygon')
      .attr('points', `
        ${mapOptions.tileSize}
        0
        ${mapOptions.tileSize + mapOptions.tileSize / 6}
        ${mapOptions.tileSize / 6}
        ${mapOptions.tileSize + mapOptions.tileSize / 6}
        ${mapOptions.tileSize + mapOptions.tileSize / 6}
        ${mapOptions.tileSize}
        ${mapOptions.tileSize}
      `)
      .style('fill', mapOptions.colors[tileValue[0]])
      .style('stroke-width', 0.1)
      .style('stroke', 'rgb(255,255,255)');

      tile.append('polygon')
      .attr('points', `
        0
        ${mapOptions.tileSize}
        ${mapOptions.tileSize / 6}
        ${mapOptions.tileSize + mapOptions.tileSize / 6}
        ${mapOptions.tileSize + mapOptions.tileSize / 6}
        ${mapOptions.tileSize + mapOptions.tileSize / 6}
        ${mapOptions.tileSize}
        ${mapOptions.tileSize}
      `)
      .style('fill', mapOptions.colors[tileValue[0]])
      .style('stroke-width', 0.1)
      .style('stroke', 'rgb(255,255,255)');
  }
}

fs.writeFileSync('game.svg', body.html());