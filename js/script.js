// Counter functionality
let count = 0;
const clickBtn = document.getElementById('clickBtn');
const message = document.getElementById('message');
const counter = document.getElementById('counter');

clickBtn.addEventListener('click', () => {
    count++;
    counter.textContent = `Counter: ${count}`;
    message.textContent = `You've clicked the button ${count} time${count !== 1 ? 's' : ''}!`;
    
    // Add a fun animation
    clickBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        clickBtn.style.transform = 'scale(1)';
    }, 100);
});

// Color changer functionality
const colorBtn = document.getElementById('colorBtn');
const colorBox = document.getElementById('colorBox');

const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
];

let currentColorIndex = 0;

colorBtn.addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    colorBox.style.background = colors[currentColorIndex];
    
    // Add a pulse animation
    colorBox.style.transform = 'scale(1.05)';
    setTimeout(() => {
        colorBox.style.transform = 'scale(1)';
    }, 200);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded successfully!');
    console.log('HTML, CSS, and JavaScript are all working together.');
});
