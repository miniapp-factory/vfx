'use client';

import { useState, useEffect } from 'react';
import { Share } from '@/components/share';
import { url } from '@/lib/metadata';

const fruits = ['Apple', 'Banana', 'Cherry', 'Lemon'] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, randomFruit)));
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  // Check win condition directly in render
  const hasWin = !spinning && (
    // rows
    (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]) ||
    (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]) ||
    (grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]) ||
    // columns
    (grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]) ||
    (grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]) ||
    (grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2])
  );

  useEffect(() => {
    if (hasWin) setWin(true);
  }, [hasWin]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(false);
    const interval = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(col => [randomFruit(), ...col.slice(0, 2)]);
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <div key={`${colIdx}-${rowIdx}`} className="w-16 h-16 flex items-center justify-center border rounded">
              <img
                src={`/${fruit.toLowerCase()}.png`}
                alt={fruit}
                className="w-12 h-12"
              />
            </div>
          ))
        )}
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
      {hasWin && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 font-semibold">You win!</p>
          <Share text={`I just won the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
