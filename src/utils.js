const cartesianToIsometric = ({ x, y }) => {
  return {
    x: (x * 64 / 2) - (y * 64 / 2),
    y: (x * 32 / 2) + (y * 32 / 2)
  }
}

const isometricToCartesian = ({ x, y }) => {
  const cartesianX = (x + y * 2) / 2
  const cartesianY = x + cartesianX
  return {
    x: cartesianX,
    y: cartesianY
  }
}

function getCardinalDirection(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 0 && dy === 0) return null;

  if (Math.abs(dy) >= Math.abs(dx)) {
    return dy < 0 ? 'N' : 'S';
  } else {
    return dx > 0 ? 'E' : 'W';
  }
}

module.exports = {
  cartesianToIsometric,
  isometricToCartesian,
  getCardinalDirection
}
