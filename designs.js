const $arrow = $('#arrow');
const $dropdown = $('#dropdown');
const $dropdownOne = $('#dropdownOne');
const $dropdownTwo = $('#dropdownTwo');
const $dropdownThree = $('#dropdownThree');
const $dropdownFour = $('#dropdownFour');
const $dropdownFive = $('#dropdownFive');
const $droprightOne = $('#droprightOne');
const $droprightTwo = $('#droprightTwo');
const sizePicker = $('#sizePicker');
const colorPicker = $('#colorPicker');
const canvas = $('#pixel_canvas');
const $footer = $('#footer');


let arrowClicked = false;
let dropdownOneClicked = false;
let dropdownTwoClicked = false;
let dropdownThreeClicked = false;
let dropdownFourClicked = false;
let dropdownFiveClicked = false;
let isDrawing = false;
let color, tableWidth, tableHeight, fillTableRow, fillTableCell, colorFill, backgroundColor;

function setMargin(index) {
  switch(index){
    case 1:
      if (dropdownTwoClicked){
        if (dropdownOneClicked){
          $droprightTwo.css('margin-top', '0vh');
        } else {
          $droprightTwo.css('margin-top', '10vh');
        }
      }
      break;
    case 2:
      if (dropdownOneClicked){
        $droprightTwo.css('margin-top', '0vh');
      } else {
        $droprightTwo.css('margin-top', '10vh');
      }
      break;
  }
}

// helper function that transforms hex colors to rbg colors for easiser conditions later on
function hexToRGB(hex) {
  let red = parseInt(hex.slice(1,3), 16);
  let blue = parseInt(hex.slice(3,5), 16);
  let green = parseInt(hex.slice(5,7), 16);
  return 'rgb(' + red +', ' + blue + ', ' + green + ')';
}

//added function for calculating whether the color is bright or dark, got the formula from 'https://www.w3.org/TR/AERT/#color-contrast'
function colorByBrightness(colorRBG) {
  let color = colorRBG.slice(4, -1);
  color = color.split(', ');
  let red = color[0];
  let blue = color[1];
  let green = color[2];
  return (red * 0.299 + green * 0.587 + blue * 0.114 < 125 ? '#ffffff' : '#000000');
}

function makeGrid() {
  let grid;

  //set the canvas table and get input values
  tableHeight = $('#input_height').val();
  tableWidth = $('#input_width').val();

  //create the canvas table HTML and save it into grid
  for (let i = 0; i < tableHeight; i++ ) {
    grid += '<tr>';
    for (let j = 0; j < tableWidth; j++) {
      grid += '<td></td>';
    }
    grid += '</tr>';
  }

  //fill the canvas table with HTML from grid
  canvas.html(grid);
}

function fill(tr, tc) {
  if ($(canvas[0].rows[tr].cells[tc]).css('background-color') === colorFill && color !== colorFill) {
    $(canvas[0].rows[tr].cells[tc]).css('background-color', color);
    if (tr!==0) {
      fill(tr-1, tc);
    }
    if (tr!==tableHeight-1){
      fill(tr+1, tc);
    }
    if (tc!==0) {
      fill(tr, tc-1);
    }
    if (tc!==tableWidth-1){
      fill(tr, tc+1);
    }
  }
}




$arrow.click(function(event){
  event.preventDefault();
  arrowClicked = !arrowClicked;
  $arrow.attr('src', arrowClicked ? 'http://i68.tinypic.com/5vsqkh.png' : 'http://i66.tinypic.com/16lhfmx.png');
  $dropdown.toggleClass('hide');
  if (dropdownOneClicked) {
    $droprightOne.toggleClass('hide');
  }
  if (dropdownTwoClicked) {
    $droprightTwo.toggleClass('hide');
  }
});

$dropdownOne.click(function(event){
  event.preventDefault();
  dropdownOneClicked = !dropdownOneClicked;
  setMargin(1);
  $('#dropdownOne img').css('background-color', dropdownOneClicked ? 'green' : '#535353');
  $droprightOne.toggleClass('hide');
});

$dropdownTwo.click(function(event){
  event.preventDefault();
  dropdownTwoClicked = !dropdownTwoClicked;
  setMargin(2);
  $('#dropdownTwo img').css('background-color', dropdownTwoClicked ? 'green' : '#535353');
  $droprightTwo.toggleClass('hide');
});

$dropdownThree.click(function(event){
  event.preventDefault();
  dropdownThreeClicked = !dropdownThreeClicked;
  $('#dropdownThree img').css('background-color', dropdownThreeClicked ? 'green' : '#535353');
});

$dropdownFour.click(function(event){
  event.preventDefault();
  dropdownFourClicked = !dropdownFourClicked;
  $('#dropdownFour img').css('background-color', dropdownFourClicked ? 'green' : '#535353');
});

$dropdownFive.click(function(event){
  event.preventDefault();
  dropdownFiveClicked = !dropdownFiveClicked;
  $('#dropdownFive img').css('background-color', dropdownFiveClicked ? 'green' : '#535353');
  $footer.toggleClass('hide');
});

sizePicker.submit(function(event){
  event.preventDefault();
  makeGrid();

  canvas.mousedown('td', function(event){
    event.preventDefault();
    if (dropdownFourClicked === false){
      color = dropdownThreeClicked ? 'white' : colorPicker.val();
      isDrawing = true;
      $(event.target).css('background-color', color);
    }
  });

  canvas.mouseup(function(event){
    event.preventDefault();
    isDrawing = false;
  });

  $('#pixel_canvas td').mouseenter(function(event){
    if (isDrawing) {
      $(event.target).css("background-color", color);
    }
  });

  $('#pixel_canvas').mouseleave(function(event){
    isDrawing = false;
  });

  $('td').click(function(event){
    if (dropdownFourClicked) {
      event.preventDefault();
      fillTableRow = $(this).closest('tr').index();
      fillTableCell = this.cellIndex;
      colorFill = $(this).css('background-color');
      color = dropdownThreeClicked ? 'rgb(255, 255, 255)' : colorPicker.val();
      fill(fillTableRow, fillTableCell);
    }
  });
});
