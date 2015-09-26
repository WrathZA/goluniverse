var rectSize = 8;
var matrix = [];
var timerRunning = false;
var totalAge = 0;

function init(){
  setupGrad();
  setTimeout(initRandomMatrix(), 0);
}

function setupGrad() {
  var grad = {
    0.0: 'hotpink',
    0.1: 'red',
    0.3: 'yellow',
    0.4: 'lime',
    0.5: 'aqua',
    0.6: 'cyan',
    0.7: 'DodgerBlue',
    0.8: 'blue',
    0.9: 'purple',
    1.0: 'DarkOrchid'
  };  
  
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, 0, 150);

  for (var i in grad) {
    gradient.addColorStop(i, grad[i]);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, 256);

  this._grad = ctx.getImageData(0, 0, 1, 256).data;
}

function initRandomMatrix() {
  var height= document.getElementById("height").value;
  var width= document.getElementById("width").value;

  var c = document.getElementById("myCanvas");
  c.width = width;
  c.height = height;

  var x = width / rectSize;
  var y = height / rectSize;
  for (var i=0; i < x; i++) {
    matrix[i] = [];
    for (var j=0; j < y; j++) {
      matrix[i][j] = Math.round(Math.random());
    }
  }
  lifeCycle(); //Fire the cycle at least once. 
  draw();
}

function draw() {
  totalAge++;
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  for (var i=0; i < matrix.length; i++) {
    for (var j=0; j < matrix[i].length; j++) {
      ctx.fillStyle = getColorFromAge(matrix[i][j]);
      ctx.beginPath();
      ctx.fillRect(i*rectSize, j*rectSize, rectSize, rectSize);
      ctx.stroke();
    }
  }
}

function getColorFromAge(age) {
    if (age === 0) {
      return "black";
    }
    if (age === 1) {
      return "white";
    }
    //WTF figure this out
    else if (age > 145) {
      return "DarkOrchid";
    }
    else {
      var x = age * 4; //4 bytes per record RGBA.
      return "rgb("+this._grad[x]+","+this._grad[x+1]+","+this._grad[x+2]+")";
    }
}

function lifeCycle() {
    //Deep clone of arrays.
    var testMatrix = [];
    for (i=0; i < matrix.length; i++) {
      testMatrix[i] = matrix[i].slice();
    }

    for (var x=0; x < testMatrix.length; x++) { //x axis
      for (var y=0; y < testMatrix[x].length; y++) { //y axis
        //count the neighbours
        var alive = 0;
        for (var i=x-1; i != x+2; i++) {
          for (var j=y-1; j != y+2; j++) {
            //Make sure we're in the bounds of the universe.
            if (((i >= 0) && (j >= 0)) && ((i < testMatrix.length) && (j < testMatrix[x].length))) {
              //Don't take outselves into account
              if (!((x == i) && (y == j))) {
                if (testMatrix[i][j]) {
                  alive++; //figure out how much is "alive" around us!
                  if (alive > 3) { //Don't waste cycles.
                    break;
                  }
                }
              }
            }
          }
          if (alive > 3) { //Don't waste cycles.
            break;
          }
        }

        if ((alive < 2) || (alive > 3)) {
          matrix[x][y] = 0; //Reset to Zero to kill;
        }
        else if (alive == 3) { //Be born or age! if we have exactly 3 neighbours
          matrix[x][y]++;
          //Exploding star functionality
          if ((matrix[x][y] > 500) && (document.getElementById("explodingStar").checked == true))
          {
              matrix[x-1][y-1] = 1;
              matrix[x][y-1] = 1;
              matrix[x+1][y-1] = 1;
              matrix[x-1][y] = 1;
              matrix[x][y] = 1; //symertry  
              matrix[x+1][y] = 1;
              matrix[x-1][y+1] = 1;
              matrix[x][y+1] = 1;
              matrix[x+1][y+1] = 1;
          }
        }
      }
    }

    draw();
    if (timerRunning) {
      setTimeout(lifeCycle, document.getElementById("interval").value);
    }
}

function toggleTimer(){
  timerRunning = !timerRunning;
  if (timerRunning) {
      setTimeout(lifeCycle, 1); //start ASAP, let the lifeCycle concern itself with the interval
      document.getElementById("blockSize").disabled=true;
    }
    else{
      document.getElementById("blockSize").disabled=false;
    }
  document.getElementById("timerButton").value = timerRunning ? "Stop Timer" : "Start Timer";
}

function rangeChange() {
  document.getElementById("rangeText").innerHTML = document.getElementById("interval").value;
}

function blockSizeChange(){
   rectSize = document.getElementById("blockSize").value;
   document.getElementById("blockSizeText").innerHTML = document.getElementById("blockSize").value;
   initRandomMatrix();
}
