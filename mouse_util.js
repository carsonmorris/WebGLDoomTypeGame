
// character variables
var Gimage;                     // texture image
var Gpixels;                    // texture pixel data array
var Gloaded;                    // isTextureLoaded boolean
var Gspeed = 0.0;                 // character speed
var Gangle = 90.0;               // camera angle
var eyepos = [0.9, 0.0, -0.75];   // camera location
var target = [0.0, 0.4, -1.0];  // where the camera is looking
var newPos = [0.0,0.0,1.0];     // the direction the camera is pointing
var scaledir = [0.0,0.0,0.0];   // used for character movement
var upVector = [0.0,1.0,0.0];   // sets camera normals

//  walls
var wallsArray = [
  [1.0, 0.0, 0.0, 90.0],  //  0
  [1.0, 0.0, 1.0, 90.0],  //  1
  [-1.0, 0.0, 0.0, 90.0], //  2
  [-1.0, 0.0, 1.0, 90.0], //  3
  [0.0, 0.0, 1.0, 0.0],   //  4
  [-1.0, 0.0, 1.0, 0.0],  //  5
  [0.0, 0.0, -1.0, 0.0],  //  6
  [-1.0, 0.0, -1.0, 0.0], //  7
  [-0.5, 0.0, -0.5, 0.0], //  8
  [0.5, 0.0, -0.5, 0.0],  //  9
  [-0.5, 0.0, 0.6, 0.0]   //  10
];
var wallRot = [
  [1.0, 0.0],
  [0.0, 1.0],
  [-1.0, 0.0],
  [0.0, -1.0]
];

// mouse variables    
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

// room variables
var xDimension = 2;
var zDimension = 2;

var roomXScale = xDimension / 2;
var roomZScale = zDimension / 2;

// keyboard variables
var keys = {};

document.addEventListener("keydown", function (event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function (event) {
    keys[event.key] = false;
});

function handleKeys() {
  if (keys["w"]) {
    // Move forward
    Gspeed = 0.02;
  } else if (keys["s"]) {
    // Move backward
    Gspeed = -0.02;
  } else {
    // Stop movement
    Gspeed = 0.0;
  }

  if (keys["a"]) {
    // Strafe left
    Gangle -= 4.0;
  } else if (keys["d"]) {
    // Strafe right
    Gangle += 4.0;
  }
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function handleMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function handleMouseUp(event) {
  mouseDown = false;
}

// called whenever the mouse moves
function handleMouseMove(event) {
  if (!mouseDown) { // only do things when mouse button down.
    return;
  }

  var newX = event.clientX;
  var newY = event.clientY;
  
  // adjusts camera angle
  var deltaX = newX - lastMouseX;
  Gangle = Gangle + (deltaX / 16.0); 

  // adjust the speed of the character
  var deltaY = newY - lastMouseY;
  Gspeed = Gspeed - deltaY/1000000.0;

  // update mouse position
  lastMouseX = newX
  lastMouseY = newY;
}

//  checks the x/z plane area of the triangle between 3 points
//  MUST recieve three 3d arrays
function checkArea(p1, p2, p3) {
  let var1 = p1[0]*(p2[1]-p3[1]);
  let var2 = p2[0]*(p1[1]-p3[1]);
  let var3 = p3[0]*(p1[1]-p2[1]);
  let retVal = 0.5 * Math.abs(var1 - var2 + var3);
  return retVal;
}

function twoDimDist(p1, p2) {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

// creates a view matrix.
function genViewMatrix()
{
  var tmpPos = eyepos.slice();
  handleKeys();
  // move character
  scaledir = vec3.scale(newPos, Gspeed, scaledir);
  vec3.add(eyepos, scaledir, eyepos); // add speed adjusted direction to eyepos

  //  keep the character in bounds
  eyepos[0] = Math.max(-1.0, Math.min(1.0, eyepos[0]));
  eyepos[2] = Math.max(-1.0, Math.min(1.0, eyepos[2]));

  //  wall collision
  for(var x = 0; x < wallsArray.length; x++) {
    var wallPos = [wallsArray[x][0], wallsArray[x][2]];
    var wallEnd = wallPos.slice();
    var rot = (Math.floor(wallsArray[x][3]) / 90) % 4;
    wallEnd[0] += wallRot[rot][0];
    wallEnd[1] += wallRot[rot][1];
    var eyeXZ = [eyepos[0], eyepos[2]];
    var tArea = checkArea(wallPos, wallEnd, eyeXZ);
    var dist1 = twoDimDist(wallEnd, eyeXZ);
    var dist2 = twoDimDist(wallPos, eyeXZ);
    if(tArea <= 0.045 && dist1 < 1 && dist2 < 1) {
      eyepos = tmpPos.slice();
      break;
    }
  }

  // set camera height
  eyepos[1] = 0.1;

  // set the cameras direction
  rotMat = mat4.create();
  mat4.identity(rotMat);
  mat4.rotate(rotMat, -degToRad(Gangle), upVector);
  newPos = [0.0, 0.0, 1.0];
  newPos = mat4.multiplyVec3(rotMat, newPos);
  
  // set point to look at
  vec3.add(newPos, eyepos, target);

  //create the view matrix
  viewMatrix = mat4.lookAt(eyepos,target,upVector);
  return viewMatrix;
}

// returns the height of the terrain for a given, x,z position.
// x and z are in the range [-1,1]. 
function getTerHeight(x,z)
{
  //scale x,z from [-1,1] to [0,Gimage.width]
  i = Math.floor((x+1)/2.0 * Gimage.width);
  j = Math.floor((z+1)/2.0 * Gimage.height);
  if (i > Gimage.width) i = Gimage.width; // bounds check
  if (j > Gimage.height) j = Gimage.height; // bounds check

  var aval = 0.0;
  if(Gloaded == 1) {
    // calculate the index offset into the Pixel Array
    var aoffset = Math.round(i * 4 + j*Gimage.width*4);
    var r = Gpixels[0 + aoffset];  // get red value
    var g = Gpixels[1 + aoffset];  // get green value
    var b = Gpixels[2 + aoffset];  // get blue value
    
    // use the formula the vertex shader uses to calculate terrain height
    var aval = Math.sqrt(r*r + g*g + b*b)/441.673;
  }
  
  return aval + 0.1;
}