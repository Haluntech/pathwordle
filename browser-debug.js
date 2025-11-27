// Debug script to inject into browser console
// Run this in the browser dev tools when on the game page

console.log('=== PathWordle Browser Debug ===');

// Get the actual game state if available
const gameStateElement = document.querySelector('[data-game-state]') ||
                         document.getElementById('main-content') ||
                         document.querySelector('#root');

console.log('Game element found:', !!gameStateElement);

// Try to access React component state
const reactRoot = document.querySelector('#root');
if (reactRoot && reactRoot._reactRootContainer && reactRoot._reactRootContainer._internalRoot) {
  const fiberNode = reactRoot._reactRootContainer._internalRoot.current;
  console.log('React Fiber Node:', fiberNode);

  // Try to find the PathWordle component
  function findPathWordleComponent(node) {
    if (node && node.type && node.type.name === 'PathWordle') {
      return node;
    }
    if (node && node.child) {
      return findPathWordleComponent(node.child);
    }
    return null;
  }

  const pathWordleComponent = findPathWordleComponent(fiberNode);
  if (pathWordleComponent && pathWordleComponent.memoizedState) {
    console.log('PathWordle state found');
    console.log('Hook state:', pathWordleComponent.memoizedState);
  }
}

// Check what letters are actually visible in the grid
const gridCells = document.querySelectorAll('[role="gridcell"], .grid-cell, button[aria-label*="row"]');
console.log('Grid cells found:', gridCells.length);

if (gridCells.length > 0) {
  const visibleLetters = [];
  gridCells.forEach((cell, index) => {
    const text = cell.textContent.trim();
    if (text) {
      visibleLetters.push({ index, letter: text, element: cell });
    }
  });

  console.log('Visible letters in grid:', visibleLetters);

  // Check for G specifically
  const gCells = visibleLetters.filter(item => item.letter === 'G' || item.letter === 'g');
  console.log('G letters found:', gCells.length);

  if (gCells.length === 0) {
    console.log('❌ NO G FOUND IN VISIBLE GRID!');
  }
}

// Check Notification and Time Challenge buttons
const notificationBtn = document.querySelector('button[aria-label*="Notification"], button:has(.text-orange-600)');
const timeChallengeBtn = document.querySelector('button[aria-label*="Time Challenge"], button:has(.text-orange-600)');

console.log('Notification button found:', !!notificationBtn);
console.log('Time Challenge button found:', !!timeChallengeBtn);

// Add click listeners to debug navigation
if (notificationBtn) {
  console.log('Adding debug listener to Notification button');
  notificationBtn.addEventListener('click', () => {
    console.log('Notification button clicked!');
    setTimeout(() => {
      console.log('Current URL:', window.location.href);
      console.log('Page title:', document.title);
    }, 100);
  });
}

if (timeChallengeBtn) {
  console.log('Adding debug listener to Time Challenge button');
  timeChallengeBtn.addEventListener('click', () => {
    console.log('Time Challenge button clicked!');
    setTimeout(() => {
      console.log('Current URL:', window.location.href);
      console.log('Page title:', document.title);
    }, 100);
  });
}