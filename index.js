const fs = require('fs');
const d3 = require('d3');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var IsoBlock = IsoBlock || {};

const dom = new JSDOM(`<!DOCTYPE html><body></body>`);

let body = d3.select(dom.window.document.querySelector('body'));
let svg = body.append('svg').attr('width', 800).attr('height', 800).attr('xmlns', 'http://www.w3.org/2000/svg');
let style = svg.append('style').text(`
  .tile {
    fill: #eee;
    stroke: #a9a9a9;
  }
  .tile:hover {
    fill: #ff00af !important;
  }
`);
let map = svg.append('g').attr('id', 'map');
let ground = map.append('g').attr('id', 'ground');
// ground.attr("transform", "translate(200, 200) rotate(45)");

const mapOptions = {
  tileSize: 80,
  tiles: [
    [[0], [0]],
    [[0], [0]]
  ],
  colors: ['#373', '#fc7']
}

for (let y = 0; y < mapOptions.tiles.length; y++) {
  for (let x = 0; x < mapOptions.tiles[y].length; x++) {
    const tileValue = mapOptions.tiles[y][x];
    let tile = ground.append('g').attr('id', `tile`);
    tile.append('rect')
      .attr('class', 'tile')
      .attr('z-index', x + y + 1)
      .attr('x', x * mapOptions.tileSize)
      .attr('y', y * mapOptions.tileSize)
      .attr('width', mapOptions.tileSize)
      .attr('height', mapOptions.tileSize)
      .style('fill', mapOptions.colors[tileValue[0]])
      .style('stroke-width', 0.1)
      .style('stroke', 'rgb(255,255,255)');

    console.log('y: ', y);
    console.log('x: ', x);
    console.log('mapOptions.tiles[y].length: ', mapOptions.tiles[y].length);
    if (x === 0) {
      tile.append('polygon')
        .attr('z-index', 1)
        .attr('points', `
        ${mapOptions.tileSize + (mapOptions.tileSize * y)}
        ${y}
        ${mapOptions.tileSize + (mapOptions.tileSize * y) + mapOptions.tileSize / 6}
        ${mapOptions.tileSize / 6}
        ${mapOptions.tileSize + mapOptions.tileSize + mapOptions.tileSize / 6 }
        ${mapOptions.tileSize + mapOptions.tileSize / 6}
        ${mapOptions.tileSize + mapOptions.tileSize}
        ${mapOptions.tileSize}
      `)
        .style('fill', mapOptions.colors[tileValue[0]])
        .style('stroke-width', 0.1)
        .style('stroke', 'rgb(255,255,255)');
    }

    if (false) {
      tile.append('polygon')
        .attr('z-index', 1)
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
}

fs.writeFileSync('game.svg', body.html());