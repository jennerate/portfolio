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

