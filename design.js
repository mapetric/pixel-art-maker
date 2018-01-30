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
let blocksHolding = [];


let mouse = {
      x: undefined,
      y: undefined
}

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

function getSize() {
      if (0.95 * windowHeight / rows >= 0.8 * windowWidth / columns) {
            dimension = 0.9 * ((0.8 * windowWidth) / columns);
      } else {
            dimension = 0.9 * ((0.95 * windowHeight) / rows);
      }
      spaceX = 0.8 * windowWidth - columns * dimension;
      spaceY = windowHeight - rows * dimension;
}

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

function resize() {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      canvas.height = windowHeight;
      canvas.width = 0.8 * windowWidth;
      getSize();
}

function drawArt() {
      c.fillStyle = 'black';
      c.fillRect(spaceX / 2, spaceY / 2, dimension * columns, dimension * rows);
      blocks.forEach (function (element) {
            c.fillStyle = element.backgroundColor;
            c.fillRect(element.x, element.y, 0.9 * dimension, 0.9 * dimension);
      });
}

function randomize() {
      rows = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
      columns = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
      blocks = [];
      gridPresent = false;
      resize();
      makeGrid();
      drawArt();
      gridPresent = true;
}

function getRandomHex() {
      let number = (Math.floor(Math.random()*(255-1) + 1).toString(16));
      if (number.length < 2) {
            number = '0' + number;
      }
      return number;
}

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


// function fill(row, column) {
//       color = selectedColor.value;
//       if (blocks[column + row * columns].backgroundColor === color) {
//             return;
//       }
//       if (blocks[column + row * columns].)
//       blocks[column + row * columns].updateColor(color);
// }


function init() {
      resize();
      window.addEventListener('resize', function() {
            resize();
            makeGrid();
            drawArt();
      });
      window.addEventListener('mousemove', function(event) {
            mouse.x = event.x - windowWidth * 0.2;
            mouse.y = event.y;
            if (holding) {
                  blocks.forEach (function(element){
                        if ((mouse.x > element.x && mouse.x < element.x + dimension) && (mouse.y  > element.y && mouse.y < element.y + dimension)){
                              if (! blocksHolding.includes(element)) {
                                    blocksHolding.push(element);
                              }
                        }
                  });
            }
      });

      canvas.addEventListener('mousedown', function(event){
            holding = true;
      });

      canvas.addEventListener('mouseup', function(event){
            holding = false;
      });

      canvas.addEventListener('mouseleave', function(event){
            holding = false;
      });


      window.addEventListener('click', function(event) {
            color = eraser ? '#ffffff' : selectedColor.value;
            if (getColorFromCanvas) {
                  selectedColor.value = (blocks[getTarget()]).backgroundColor;
                  color = (blocks[getTarget()]).backgroundColor;
            } else if (gridPresent) {
                  if (!holding && blocks[getTarget()] !== undefined ) {
                        blocksHolding.push(blocks[getTarget()]);
                  }
                  blocks.forEach (function (element) {
                        if ((mouse.x > element.x && mouse.x < element.x + dimension) && (mouse.y  > element.y && mouse.y < element.y + dimension)){
                              element.updateColor(color);
                              if (element.lastColor === element.backgroundColor){
                                    element.updateColor('#ffffff');
                              }
                        }
                  });
                  blocksHolding.forEach(function(element){
                        element.updateColor(color);
                  });
                  drawArt();
                  blocksHolding = [];
            }
      });

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
      resetGrid.addEventListener('click', function(event) {
            event.preventDefault();
            if (gridPresent) {
                  blocks.forEach (function(element){
                        element.updateColor('#ffffff');
                  })
            }
      });
      randomizeGrid.addEventListener('click', function(event) {
            event.preventDefault();
            randomize();
      });
      randomColors.addEventListener('click', function(event) {
            event.preventDefault();
            randomizeColors();
      });
      eraserButton.addEventListener('click', function(event) {
            event.preventDefault();
            eraserButton.style.borderColor = eraser ? '#ffffff' : '#00ff00';
            eraser = !eraser;
            if (getColorFromCanvas) {
                  colorFromCanvas.style.borderColor = getColorFromCanvas ? '#ffffff' : '#00ff00';
                  getColorFromCanvas = !getColorFromCanvas;
            }

      });
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
