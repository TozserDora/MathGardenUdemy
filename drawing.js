const CANVAS_BG = '#000000';
const LINE_COLOR = '#BCFF00';
const LINE_WIDTH = 10;

var previousX = 0;
var previousY = 0;

var canvas;
var context;

function prepareCanvas() {
    console.log('Preparing canvas...');
    canvas = document.getElementById('black-canvas');
    context = canvas.getContext('2d');
    context.fillStyle = CANVAS_BG;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round';

    drawingOn = false;
    
    document.addEventListener('mousedown', function (event) {
        // console.log('CLICKED!');
        // console.log('X-cor: ' + event.clientX + ' and ' + 'Y-cor: ' + event.clientY);

        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
        drawingOn = true;
    })


    document.addEventListener('mouseup', function (event) {
        drawingOn = false;
    })
        

    document.addEventListener('mousemove', function (event) {
    if (drawingOn) {
        // console.log('MOVING!');
        previousX = currentX;
        previousY = currentY;
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;

        // console.log(`Current X: ${currentX}, current Y: ${currentY}`);

        draw();
    }})
    
    canvas.addEventListener('mouseleave', function(event) {
        drawingOn = false;
    })


// FOR PHONES AND TABLETS
// Don't forget to enable Touch simulation on Firefox Inspect mode
    canvas.addEventListener('touchstart', function (event) {
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;
        drawingOn = true;
    });
    
    canvas.addEventListener('touchend', function (event) {
        drawingOn = false;
    });

    canvas.addEventListener('touchmove', function (event) {
        if (drawingOn) {
            // console.log('MOVING!');
            previousX = currentsX;
            previousY = currentY;
            currentX = event.touches[0].clientX - canvas.offsetLeft;
            currentY = event.touches[0].clientY - canvas.offsetTop;
    
            // console.log(`Current X: ${currentX}, current Y: ${currentY}`);
    
            draw();
        }})
        
        canvas.addEventListener('touchcancel', function(event) {
            drawingOn = false;
        });
}

function draw() {
    context.beginPath();
    context.moveTo(x = previousX, y = previousY);
    context.lineTo(x = currentX, y = currentY);
    context.closePath();
    context.stroke();
}

function clearCanvas() {
    previousX = 0;
    previousY = 0;
    currentX = 0;
    currentY = 0;

    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight); 
}