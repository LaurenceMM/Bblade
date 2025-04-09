function distance(ax, ay, bx, by) {
  let a = ax-bx
  let b = ay-by
  return Math.sqrt(a**2 + b**2)
}

function dotProduct(ax, ay, bx, by) {
  return ax*bx + ay*by
}

function normallizeVec(x, y) {
  let length = Math.sqrt(x**2 + y**2)
  return [x/length, y/length]
}

function drawRotatedImage(context, image, x, y, angle, width = image.width, height = image.height) {
  // save the current coordinate system before we alter it
  context.save();

  // move to the center of where we want to draw the image
  context.translate(x, y);

  // rotate around that point
  context.rotate(angle);

  // draw the image, adjusting the width and height if provided
  context.drawImage(image, -(width / 2), -(height / 2), width, height);

  // restore the coordinate system to how it was before
  context.restore();
}

function cap1stLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function drawBar(percentage, x, y, width, height) {
  let lev = width * percentage
  let inv = width - lev
  
  fxCtx.fillRect(x + inv, y, lev, height)

  fxCtx.fillStyle = 'black';
  fxCtx.fillRect(x, y, inv, height);
}

function drawRadialBar(percentage, x, y, radius) {
  fxCtx.beginPath()
  fxCtx.moveTo(x, y)
  fxCtx.arc(x, y, radius, 0, Math.PI*2 * percentage)
  fxCtx.lineTo(x, y)
  fxCtx.fill()
}

function valuePicker(type, att, def, sta) {
  switch(type){
    case "attack": return att
    case "defence": return def
    case "stamina": return sta
    default: console.error("Unknown Type:", type)
  }
}
