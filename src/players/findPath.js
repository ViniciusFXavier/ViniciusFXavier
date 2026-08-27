/*
 * Simple pathfinding on a 2D grid using BFS (for equal-cost moves).
 * Accepts start and end coordinates, and allows configurable diagonal movement.
 * Cells with value 0 are blocked; any other value is traversable.
 */

/**
 * Find a path from start to end on a grid.
 * @param {number[][]} grid - 2D array representing the room, 0 = blocked, others = free.
 * @param {{x: number, y: number}} start - Starting point {x, y} in grid coordinates.
 * @param {{x: number, y: number}} end - Destination point {x, y} in grid coordinates.
 * @param {boolean} [allowDiagonal=false] - Whether diagonal moves are allowed.
 * @returns {Array<{x: number, y: number}> | null} - Array of points from start to end, or null if no path.
 */
const findPath = (grid, start, end, allowDiagonal = false) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  const orthogonal = [
    { dx:  1, dy:  0 },
    { dx: -1, dy:  0 },
    { dx:  0, dy:  1 },
    { dx:  0, dy: -1 },
  ];
  const diagonals = [
    { dx:  1, dy:  1 },
    { dx:  1, dy: -1 },
    { dx: -1, dy:  1 },
    { dx: -1, dy: -1 },
  ];
  const directions = allowDiagonal ? [...orthogonal, ...diagonals] : orthogonal;

  function isValid(x, y) {
    return (
      x >= 0 && x < cols &&
      y >= 0 && y < rows &&
      grid[y][x] !== 0
    );
  }

  function key(x, y) {
    return `${x},${y}`;
  }

  const visited = new Set();
  const parent = new Map();
  const queue = [];

  if (!start || !end) {
    return null;
  }
  if (!isValid(start.x, start.y) || !isValid(end.x, end.y)) {
    return null;
  }
  queue.push({ x: start.x, y: start.y });
  visited.add(key(start.x, start.y));

  let found = false;

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.x === end.x && current.y === end.y) {
      found = true;
      break;
    }

    for (const { dx, dy } of directions) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const k = key(nx, ny);
      if (!visited.has(k) && isValid(nx, ny)) {
        visited.add(k);
        parent.set(k, current);
        queue.push({ x: nx, y: ny });
      }
    }
  }

  if (!found) {
    return null;
  }

  const path = [];
  let stepKey = key(end.x, end.y);
  while (stepKey !== key(start.x, start.y)) {
    const [sx, sy] = stepKey.split(",").map(Number);
    path.push({ x: sx, y: sy });
    const prev = parent.get(stepKey);
    stepKey = key(prev.x, prev.y);
  }

  path.push({ x: start.x, y: start.y });
  path.reverse();

  return path;
}

module.exports = {
  findPath
}
