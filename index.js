const fs = require('fs');
const d3 = require('d3');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var IsoBlock = IsoBlock || {};

const dom = new JSDOM(`<!DOCTYPE html><body></body>`);

let body = d3.select(dom.window.document.querySelector('body'));
let svg = body.append('svg').attr('width', 700).attr('height', 700).attr('xmlns', 'http://www.w3.org/2000/svg');
let style = svg.append('style').text(`
  .tile {
    fill: #eee;
    stroke: #a9a9a9;
  }
  .tile:hover {
    fill: #ff00af !important;
  }
`);
var defs = svg.append("defs");

var tileSideGradientLeft = defs.append("linearGradient")
  .attr("id", "tileSideGradientLeft")
  .attr("x1", "0%")
  .attr("x2", "100%")
  .attr("y1", "0%")
  .attr("y2", "100%")
  .attr("gradientTransform", "rotate(-45)");
tileSideGradientLeft.append("stop")
  .attr('class', 'start')
  .attr("offset", "0%")
  .attr("stop-color", "#7da343")
  .attr("stop-opacity", 1);
tileSideGradientLeft.append("stop")
  .attr('class', 'start')
  .attr("offset", "50%")
  .attr("stop-color", "#7da343")
  .attr("stop-opacity", 1);
tileSideGradientLeft.append("stop")
  .attr('class', 'start')
  .attr("offset", "50%")
  .attr("stop-color", "#bb8d5d")
  .attr("stop-opacity", 1);
tileSideGradientLeft.append("stop")
  .attr('class', 'end')
  .attr("offset", "100%")
  .attr("stop-color", "#bb8d5d")
  .attr("stop-opacity", 1);

var tileSideGradientRight = defs.append("linearGradient")
.attr("id", "tileSideGradientRight")
.attr("x1", "0%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "100%")
.attr("gradientTransform", "rotate(45)");
tileSideGradientRight.append("stop")
.attr('class', 'start')
.attr("offset", "0%")
.attr("stop-color", "#7da343")
.attr("stop-opacity", 1);
tileSideGradientRight.append("stop")
.attr('class', 'start')
.attr("offset", "50%")
.attr("stop-color", "#7da343")
.attr("stop-opacity", 1);
tileSideGradientRight.append("stop")
.attr('class', 'start')
.attr("offset", "50%")
.attr("stop-color", "#bb8d5d")
.attr("stop-opacity", 1);
tileSideGradientRight.append("stop")
.attr('class', 'end')
.attr("offset", "100%")
.attr("stop-color", "#bb8d5d")
.attr("stop-opacity", 1);

const mapOptions = {
  tileHeight: 10,
  tileSize: 40,
  tiles: Array.from(Array(12), () => new Array(12)),
  colors: ['#373', '#fc7']
}
let map = svg.append('g').attr('id', 'map');
let ground = map.append('g').attr('id', 'ground');
ground.attr('transform', `translate(340, 0) rotate(45)`);

for (let y = 0; y < mapOptions.tiles.length; y++) {
  for (let x = 0; x < mapOptions.tiles[y].length; x++) {
    const tileValue = mapOptions.tiles[y][x];
    let tile = ground.append('g')
      .attr('id', `tile`)
      .attr('transform', `matrix(1, 0, 0, 1, ${x * mapOptions.tileSize}, ${y * mapOptions.tileSize})`);

    tile.append('rect')
      .attr('class', 'tile')
      .attr('width', mapOptions.tileSize)
      .attr('height', mapOptions.tileSize)
      .style('fill', '#7da343')
      .style('stroke-width', 0.1)
      .style('stroke', 'rgb(255,255,255)');

    tile.append('text').text(`${x}, ${y}`)
      .attr('x', - mapOptions.tileSize / 4)
      .attr('y', mapOptions.tileSize - mapOptions.tileSize / 4)
      .attr('transform', 'rotate(-45)')
      .attr('fill', 'black')
      .style('font-size', '10px')
      .style('pointer-events', 'none')
      .style('-webkit-user-select', 'none')
      .style('-moz-user-select', 'none')
      .style('-ms-user-select', 'none')
      .style('user-select', 'none');

    if (x + 1 === mapOptions.tiles[y].length) {
      tile.append('polygon')
        .attr('points', `${mapOptions.tileSize} 0 ${mapOptions.tileSize + mapOptions.tileHeight} ${mapOptions.tileHeight} ${mapOptions.tileSize + mapOptions.tileHeight} ${mapOptions.tileSize + mapOptions.tileHeight} ${mapOptions.tileSize} ${mapOptions.tileSize}`)
        .style('fill', 'url(#tileSideGradientLeft)')
        .attr("gradientTransform", "rotate(45)")
        .style('stroke-width', 0.1)
        .style('stroke', 'rgb(255,255,255)');
    }

    if (y + 1 === mapOptions.tiles.length) {
      tile.append('polygon')
        .attr('points', `0 ${mapOptions.tileSize} ${mapOptions.tileHeight} ${mapOptions.tileSize + mapOptions.tileHeight} ${mapOptions.tileSize + mapOptions.tileHeight} ${mapOptions.tileSize + mapOptions.tileHeight} ${mapOptions.tileSize} ${mapOptions.tileSize}`)
        .style('fill', 'url(#tileSideGradientRight)')
        .style('stroke-width', 0.1)
        .style('stroke', 'rgb(255,255,255)');
    }
  }
}

// fs.writeFileSync('game.svg', body.html());
console.log(body.html());
