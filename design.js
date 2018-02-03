const canvas = document.getElementById('screen');
const c = canvas.getContext('2d');
const submit = document.getElementById("button");
const selectedColor = document.getElementById('colorPicker');
const submitGrid = document.getElementById('button');
const gridWidth = document.getElementById('input_width');
const gridHeight = document.getElementById('input_height');
const resetGrid = document.getElementById('reset');
const randomizeGrid = document.getElementById('random');
const randomColors = document.getElementById('randomColors');
const eraserButton = document.getElementById('eraser');
const colorFromCanvas = document.getElementById('colorFromCanvas');


let color, rows, columns, dimension, windowHeight, windowWidth, spaceX, spaceY;
let gridPresent = false;
let fill = true;
let holding = false;
let eraser = false;
let getColorFromCanvas = false;
let blocks = [];

// object that will keep the coordinates for the mouse.
let mouse = {
      x: undefined,
      y: undefined
}

// function object that will take care of our 'pixels'
function Block(x, y) {
      this.x = x;
      this.y = y;
      this.backgroundColor = '#ffffff';
      this.updateColor = function(color){
            this.lastColor = this.backgroundColor;
            this.backgroundColor = color;
      }
      this.update = function(i, j){
            this.x = spaceX/2 + dimension * (j + 0.05);
            this.y = spaceY/2 + dimension * (i + 0.05);
      }
}

// function that determinates the dimensions for our pixels and the spacing of the canvas on the screen
function getSize() {
      if (0.95 * windowHeight / rows >= 0.8 * windowWidth / columns) {
            dimension = 0.9 * ((0.8 * windowWidth) / columns);
      } else {
            dimension = 0.9 * ((0.95 * windowHeight) / rows);
      }
      spaceX = 0.8 * windowWidth - columns * dimension;
      spaceY = windowHeight - rows * dimension;
}

// function that creates the grid if it's not present, if it is present it just updates it (for resizing)
function makeGrid() {
      if (!gridPresent){
            for (let i = 0; i < rows; i++) {
                  for (let j = 0; j < columns; j++) {
                        blocks.push(new Block(spaceX/2 + dimension * (j + 0.05), spaceY/2 + dimension * (i + 0.05)));
                  }
            }
      } else {
            for (let i = 0; i < rows; i++) {
                  for (let j = 0; j < columns; j++) {
                        blocks[i * columns + j].update(i, j);
                  }
            }
      }

}

// function that resizes the canvas to fit the window
function resize() {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      canvas.height = windowHeight;
      canvas.width = 0.8 * windowWidth;
      getSize();
}

// function that draws the borders and pixels
function drawArt() {
      c.fillStyle = 'black';
      c.fillRect(spaceX / 2, spaceY / 2, dimension * columns, dimension * rows);
      blocks.forEach (function (element) {
            c.fillStyle = element.backgroundColor;
            c.fillRect(element.x, element.y, 0.9 * dimension, 0.9 * dimension);
      });
}

// function that creates a grid with random number of rows and columns
function randomize() {
      rows = Math.floor(Math.random() * (50)) + 1;
      columns = Math.floor(Math.random() * (50)) + 1;
      blocks = [];
      gridPresent = false;
      resize();
      makeGrid();
      drawArt();
      gridPresent = true;
}

// function that gets a random hex number thats between 0-255 in decimal
function getRandomHex() {
      let number = (Math.floor(Math.random()*(254) + 1).toString(16));
      if (number.length < 2) {
            number = '0' + number;
      }
      return number;
}

// function that fills the pixels with random hex colors
function randomizeColors() {
      if (gridPresent) {
            blocks.forEach (function(element){
                  element.updateColor('#' + getRandomHex() + getRandomHex() + getRandomHex());
            });
            resize();
            makeGrid();
            drawArt();
      }
}

// function that returns the index of the pixel you clicked onto
function getTarget() {
      let solution;
      if (gridPresent) {
            blocks.forEach (function (element) {
                  if ((mouse.x > element.x && mouse.x < element.x + dimension) && (mouse.y  > element.y && mouse.y < element.y + dimension)){
                        solution = blocks.indexOf(element);
                  }
            });
            return solution;
      }
}

// function that initializes the app
function init() {
      resize();

      // event listener when resizing the screen
      window.addEventListener('resize', function() {
            resize();
            makeGrid();
            drawArt();
      });

      // event listener that logs the coordinates of the mouse on the canvas when moving and adds the pixel boxes you enter to the array if holding down left button (if they aren't in the array already)
      window.addEventListener('mousemove', function(event) {
            event.preventDefault();
            mouse.x = event.x - windowWidth * 0.2;
            mouse.y = event.y;
            color = color = eraser ? '#ffffff' : selectedColor.value;
            if (holding && !getColorFromCanvas) {
                  blocks.forEach (function(element){
                        if ((mouse.x > element.x && mouse.x < element.x + dimension) && (mouse.y  > element.y && mouse.y < element.y + dimension)){
                              element.updateColor(color);
                              drawArt();
                        }
                  });
            }
      });

      // event listener  that tracks mousedown
      canvas.addEventListener('mousedown', function(event){
            event.preventDefault();
            holding = true;
      });

      // event listener  that tracks mouseup
      canvas.addEventListener('mouseup', function(event){
            event.preventDefault();
            holding = false;
      });

      // event listener  that tracks the moment the mouse leaves the canvas and sets the holding boolean to false
      canvas.addEventListener('mouseleave', function(event){
            event.preventDefault();
            holding = false;
      });

      // event listener  that takes care of updating colors of pixels when drawing, it also gets the color of the pixel if the color from canvas button is pressed
      window.addEventListener('click', function(event) {
            color = eraser ? '#ffffff' : selectedColor.value;
            if (getColorFromCanvas && gridPresent) {
                  color = (blocks[getTarget()]).backgroundColor;
                  selectedColor.value = color;
                  colorFromCanvas.style.borderColor = getColorFromCanvas ? '#ffffff' : '#00ff00';
                  getColorFromCanvas = !getColorFromCanvas;
            } else if (gridPresent) {
                  blocks.forEach (function (element) {
                        if ((mouse.x > element.x && mouse.x < element.x + dimension) && (mouse.y  > element.y && mouse.y < element.y + dimension)){
                              element.updateColor(color);
                        }
                  });
                  drawArt();
            }
      });

      // event listener takes care of getting the user input for the grid
      submitGrid.addEventListener('click', function(event) {
            event.preventDefault();
            if (gridPresent) {
                  gridPresent = false;
                  c.fillStyle = '#ffffff';
                  c.fillRect(spaceX / 2, spaceY / 2, dimension * columns, dimension * rows);
                  blocks = [];
            }
            rows = gridHeight.value;
            columns = gridWidth.value;
            if (rows > 50) {
                  rows = 50;
            }
            if (columns > 50) {
                  columns = 50;
            }
            resize();
            makeGrid();
            drawArt();
            gridPresent = true;
      });

      // event listener for reset button
      resetGrid.addEventListener('click', function(event) {
            event.preventDefault();
            if (gridPresent) {
                  blocks.forEach (function(element){
                        element.updateColor('#ffffff');
                  })
            }
      });

      // event listener for randomize grid button
      randomizeGrid.addEventListener('click', function(event) {
            event.preventDefault();
            randomize();
      });

      // event listener for random colors button
      randomColors.addEventListener('click', function(event) {
            event.preventDefault();
            randomizeColors();
      });

      // event listener that sets the border color for eraser button based on it's state and changes it's state (if color from canvas is pressed it turns it off)
      eraserButton.addEventListener('click', function(event) {
            event.preventDefault();
            eraserButton.style.borderColor = eraser ? '#ffffff' : '#00ff00';
            eraser = !eraser;
            if (getColorFromCanvas) {
                  colorFromCanvas.style.borderColor = getColorFromCanvas ? '#ffffff' : '#00ff00';
                  getColorFromCanvas = !getColorFromCanvas;
            }

      });

      // event listener that sets the border color for color from canvas button based on it's state and changes it's state (if eraser is pressed it turns it off)
      colorFromCanvas.addEventListener('click', function(event) {
            event.preventDefault();
            colorFromCanvas.style.borderColor = getColorFromCanvas ? '#ffffff' : '#00ff00';
            getColorFromCanvas = !getColorFromCanvas;
            if (eraser) {
                  eraserButton.style.borderColor = eraser ? '#ffffff' : '#00ff00';
                  eraser = !eraser;
            }
      });


}

init();
