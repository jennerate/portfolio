// The assets you want to cycle through
const metaAssets = [
    'assets/v3_transparent.gif',
    'assets/VerificationCenterLargeScreens.png',
];

let metaIndex = 0;
const metaProjectBlock = document.getElementById('verification');
const nextVerificationBtn = document.getElementById('meta-carousel-btn');

// Only run if the elements actually exist on the page
if (nextVerificationBtn && metaProjectBlock) {
    nextVerificationBtn.addEventListener('click', () => {
        metaIndex = (metaIndex + 1) % metaAssets.length;
        metaProjectBlock.style.backgroundImage = `url('${metaAssets[metaIndex]}')`;
    });
}


const designSystemAssets = [
    'assets/phonev1_transparent.gif', 
    'assets/Tilev7.png'  
];

let systemIndex = 0;
const systemProjectBlock = document.getElementById('design-systems');
const nextDesignSystemsBtn = document.getElementById('design-system-carousel-btn');

if (nextDesignSystemsBtn && systemProjectBlock) {
    nextDesignSystemsBtn.addEventListener('click', () => {
        // Move to the next image
        systemIndex = (systemIndex + 1) % designSystemAssets.length;
        systemProjectBlock.style.backgroundImage = `url('${designSystemAssets[systemIndex]}')`;
        
        // Forcefully apply the correct class and strip the wrong one
        if (systemIndex === 0) {
            // We are on the GIF
            systemProjectBlock.classList.add('is-gif');
            systemProjectBlock.classList.remove('is-png');
        } else {
            // We are on the PNG
            systemProjectBlock.classList.add('is-png');
            systemProjectBlock.classList.remove('is-gif');
        }
    });
}


const illustrationAssets = [
    'assets/Frank.png',
    'assets/Donald.png',
];

let illoIndex = 0;
const illustrationBlock = document.getElementById('illustrations');

// BUG 1: Removed the accidental quote mark inside the ID string ('"illustration...')
const nextIllustrationBtn = document.getElementById('illustration-carousel-btn');

// BUG 2: Replaced the mangled variable name (systemPillustrationBlockrojectBlock)
if (nextIllustrationBtn && illustrationBlock) {
    nextIllustrationBtn.addEventListener('click', () => {
        illoIndex = (illoIndex + 1) % illustrationAssets.length;
        illustrationBlock.style.backgroundImage = `url('${illustrationAssets[illoIndex]}')`;
        illustrationBlock.classList.toggle('repeat-pattern', illoIndex === 1);
    });
}

// script.js
const panel = document.getElementById('sticker-panel');
const canvas = document.getElementById('canvas');

let activeSticker = null;
let offsetX = 0;
let offsetY = 0;

// 1. Listen for the start of a drag
document.addEventListener('pointerdown', (e) => {
  // Check if what we clicked is a sticker
  if (e.target.classList.contains('sticker')) {
    const clickedSticker = e.target;
    
    // Calculate where on the sticker the user clicked
    const rect = clickedSticker.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // If clicking a sticker in the side panel, clone it!
    if (clickedSticker.parentElement === panel) {
      activeSticker = clickedSticker.cloneNode(true);
      document.body.appendChild(activeSticker); // Append to body so it floats above everything
    } else {
      // If clicking a sticker already on the canvas, just pick it up
      activeSticker = clickedSticker;
      document.body.appendChild(activeSticker); // Bring to front
    }

    activeSticker.classList.add('dragging');
    moveSticker(e.clientX, e.clientY);
  }
});

// 2. Listen for mouse/touch movement
document.addEventListener('pointermove', (e) => {
  if (!activeSticker) return;
  
  // Prevent default scrolling on mobile while dragging
  e.preventDefault(); 
  moveSticker(e.clientX, e.clientY);
});

// 3. Listen for the release of the mouse/touch
document.addEventListener('pointerup', (e) => {
  if (!activeSticker) return;

  activeSticker.classList.remove('dragging');
  
  // Check if we dropped it over the canvas
  const canvasRect = canvas.getBoundingClientRect();
  const isOverCanvas = (
    e.clientX >= canvasRect.left &&
    e.clientX <= canvasRect.right &&
    e.clientY >= canvasRect.top &&
    e.clientY <= canvasRect.bottom
  );

  if (isOverCanvas) {
    // Move sticker DOM element into the canvas container
    canvas.appendChild(activeSticker);
    
    // Calculate its final resting position relative to the canvas
    const finalLeft = e.clientX - canvasRect.left - offsetX;
    const finalTop = e.clientY - canvasRect.top - offsetY;
    
    activeSticker.style.left = `${finalLeft}px`;
    activeSticker.style.top = `${finalTop}px`;
    
    // Hide the placeholder text once a sticker is placed
    document.querySelector('.placeholder-text').style.display = 'none';
  } else {
    // If dropped outside the canvas area, delete the clone
    activeSticker.remove();
  }

  activeSticker = null;
});

// Helper function to update the physical location of the sticker
function moveSticker(clientX, clientY) {
  activeSticker.style.left = `${clientX - offsetX}px`;
  activeSticker.style.top = `${clientY - offsetY}px`;