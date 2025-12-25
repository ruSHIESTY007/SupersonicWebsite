// Get the canvas element

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Get control containers
const parametricModeControls = document.getElementById('parametricModeControls');
const interactiveModeControls = document.getElementById('interactiveModeControls');

// Set the canvas size (Really important!)
canvas.width = window.innerWidth;
canvas.height = 600;

// Track state?
let startPoint = null; // This will store the first click position
let isDrawing = false;
let currentMode = 'parametric'

// Parallelogram Mode Parameters
let parallelogramWidth = 200;
let parallelogramHeight = 100;
let paraCenterX = window.innerWidth / 2;
let paraCenterY = canvas.height / 3;
let paraAngleInput = 0; // USER DEFINED

console.log(paraCenterX, paraCenterY);

// Get control for sliders
const widthSlider = document.getElementById('widthSlider');
const widthInput = document.getElementById('widthInput');

const heightSlider = document.getElementById('heightSlider');
const heightInput = document.getElementById('heightInput');


// Listen for clicks on the canvas
canvas.addEventListener('click', function(event) {
    // Check mode
    if (currentMode !== 'interactive') return;

    // Get mouse position
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (startPoint == null) {
        // If this is the first click
        startPoint = { x: x, y: y};
        isDrawing = true;
        console.log('Start point set:', startPoint);
    } else {
        //Second click - draw the line
        drawLine(startPoint.x, startPoint.y, x, y);

        // Reset for next line
        if (lines.length > 2 &&
            lines[lines.length - 1].x2 === lines[0].x1 &&
            lines[lines.length - 1].y2 === lines[0].y1) {
                // Shape is closed so lets finsih the drawing process
            isDrawing = false;
            startPoint = null;
            redrawCanvas();
            console.log('Shape is Closed!')
        } else {
            startPoint = {x: x, y: y};
            isDrawing = true;
        }
    }

});

// Listen to the mouse movement and show the preview of the line
canvas.addEventListener('mousemove', function(event) {
    // Check mode
    if (currentMode !== 'interactive') return;
    if (!isDrawing) return; // Show preview if we have a start point

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Incorporate snapping for preview
    let snapped = snapToFirstVertex(x, y);

    // Redraw everything
    redrawCanvas();

    // Draw preview line
    drawPreviewLine(startPoint.x, startPoint.y, snapped.x, snapped.y);
    if (snapped.x !== x || snapped.y !== y) {
        ctx.beginPath();
        ctx.arc(snapped.x, snapped.y, 8, 0, 2 * Math.PI);
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2;
        ctx.stroke();
    }
});


// Add click event listener for reset button
const resetButtonInteractive = document.getElementById('resetButtonInteractive');
resetButtonInteractive.addEventListener('click', clearCanvas);


// Add click event listener for the calculate button PARAMETRIC
const calculateButtonParametric = document.getElementById('calculateButtonParametric');
calculateButtonParametric.addEventListener('click', calculatePressures);

// Add click event listener for the calculate button INTERACTIVE
const calculateButtonInteractive = document.getElementById('calculateButtonInteractive');
calculateButtonInteractive.addEventListener('click', calculatePressures);

// Event listeners for the tabs
const parametricModeTab = document.getElementById('parametricModeTab');
const interactiveModeTab = document.getElementById("interactiveModeTab");

// Listens for parametric mode swap
parametricModeTab.addEventListener('click', function() {
    currentMode = 'parametric';

    //Update tab appearance
    parametricModeTab.classList.add('active');
    interactiveModeTab.classList.remove('active');

    parametricModeControls.style.display = 'block';
    interactiveModeControls.style.display = 'none';

    clearCanvas();
    drawParallelogram();
    // DRAW PARALLELOGRAM HERE


    console.log("User Switched to Parametric Mode");
});

// Listens for interactive mode swap
interactiveModeTab.addEventListener('click', function() {
    currentMode = 'interactive';

    // Adjust tab states
    interactiveModeTab.classList.add('active');
    parametricModeTab.classList.remove('active');

    parametricModeControls.style.display = 'none';
    interactiveModeControls.style.display = 'block';

    clearCanvas();

    console.log("User Switched to Interactive Mode");
});


// Store permanent lines
let lines = [];

// Parametric Mode changes for width
widthSlider.addEventListener('input', function(){
    // Get new value from slider
    parallelogramWidth = parseInt(this.value);

    // Update number input to match
    widthInput.value = parallelogramWidth;

    // Redraw the shape
    drawParallelogram();

    console.log("Width changed to: ", parallelogramWidth);
});

// Listen for number input changes
widthInput.addEventListener('input', function() {
    // Get value from input
    parallelogramWidth = parseInt(this.value);

    // Update the slider to match
    widthSlider.value = parallelogramWidth;

    // Redraw the shape
    drawParallelogram();
    
    console.log("Width changed to: ", parallelogramWidth);

});


// Parametric Mode changes for height
heightSlider.addEventListener('input', function(){
    // Get new value from slider
    parallelogramHeight = parseInt(this.value);

    // Update number input to match
    heightInput.value = parallelogramHeight;

    // Redraw the shape
    drawParallelogram();

    console.log("Height changed to: ", parallelogramHeight);
});

// Listen for number input changes
heightInput.addEventListener('input', function() {
    // Get value from input
    parallelogramHeight = parseInt(this.value);

    // Update the slider to match
    heightSlider.value = parallelogramHeight;

    // Redraw the shape
    drawParallelogram();
    
    console.log("Width changed to: ", parallelogramHeight);

});


function drawLine(x1, y1, x2, y2) {
    // Save Line
    let endPoint = snapToFirstVertex(x2, y2);
    lines.push({x1, y1, x2: endPoint.x, y2: endPoint.y});

    // Test: Draw a line
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();  
}


function drawPreviewLine(x1, y1, x2, y2) {
    // function to draw a preview
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add all lines
    for (let line of lines) {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}



function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startPoint = null;
    isDrawing = false;
    lines = [];
}




function calculatePressures() {
    if (verifyCanvas()) {
        // Run the calculate pressure stuff
        alert("Shape is a valid Polygon! Commencing analysis!");
        console.log("Loading...")
    }
}

function verifyCanvas() {
    if (lines.length < 3) {
        alert("Please draw a valid shape first!");
        return false;
    }

    if (!isShapeClosed(lines)) {
        alert("Polygon candidate is NOT closed! Please connect the last point to the first!");
        // no easy way to guarantee this rn. ////////////////////////////////////////////// Fix this
        return false;
    }

    if (!isConvex(linesToVertices(lines))) {
        alert("This shape is unfortunately not convex. This solver does not supposed concave polygons yet.");
        return false;
    }

    return true;
}

function snapToFirstVertex(x, y) {
    if (lines.length === 0) {
        return {x: x, y: y};
        // NO lines so don't snap
    }

    // Figure out first point
    let firstPoint = {x: lines[0].x1, y: lines[0].y1};

    // Figure out distances
    let dx = x - firstPoint.x;
    let dy = y - firstPoint.y;
    let distance = Math.sqrt(dx*dx + dy*dy);

    // Snap threshold (PIXELS)
    let threshold = 10;

    if (distance < threshold) {
        return firstPoint;
        // Snap! We are within the threshold!
    }

    return {x: x, y: y};
    // NO Snap! We aren't within threshold!
}

function drawParallelogram() {
    if (currentMode !== 'parametric') return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Angle Conversion
    let paraAngle = paraAngaleInput * Math.PI / 180;

    // width *  cos(theta) + hieght * sin(theta)
    let startX = paraCenterX + Math.cos(paraAngle) * parallelogramWidth / 2;
    let startY = paraCenterY + Math.sin(paraAngle) * parallelogramWidth / 2;
    let endX = paraCenterX - Math.cos(paraAngle) * parallelogramWidth / 2;
    let endY = paraCenterY - Math.sin(paraAngle) * parallelogramWidth / 2;

    let bottomX = paraCenterX + Math.sin(paraAngle) * parallelogramHeight / 2;
    let bottomY = paraCenterY - Math.cos(paraAngle) * parallelogramHeight / 2;
    let topX = paraCenterX - Math.sin(paraAngle) * parallelogramHeight / 2;
    let topY = paraCenterY + Math.cos(paraAngle) * parallelogramHeight / 2;

    ctx.beginPath();
    // Top leading Edge
    ctx.moveTo(startX,startY);
    ctx.lineTo(topX,topY);
    
    // Top Trailing Edge
    ctx.lineTo(endX, endY);

    // Bottom Trailing Edge
    ctx.lineTo(bottomX, bottomY);

    // Bottom Leading Edge
    ctx.lineTo(startX, startY);
    ctx.setLineDash([10, 0])
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dashed line
    ctx.beginPath();

    // Top to bottom line
    ctx.moveTo(topX, topY);
    ctx.lineTo(bottomX, bottomY);

    // Front to end line
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.setLineDash([10, 2])
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
}

if (currentMode === 'parametric') {
    drawParallelogram();
}
