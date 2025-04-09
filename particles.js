class beyPartC {
  constructor(x, y, sx, sy, spin, img, radius){
    this.x = x
    this.y = y
    this.sx = sx * 0.7
    this.sy = sy * 0.7
    this.img = img
    this.radius = radius
    this.angle = Math.PI*2 * Math.random()
    this.spin = spin
    
    let temp = Math.random()*Math.PI*2
    let dx = Math.cos(temp)
    let dy = Math.sin(temp)
    let impulse = (Math.random()*0.5+0.5) * spin * 0.1
    this.sx += dx * impulse
    this.sy += dy * impulse
  }
  draw(){
    this.angle += this.spin/100
    this.angle %= Math.PI*2
    this.spin *= 0.99

    let dist = distance(this.x, this.y, canvas.width/2, canvas.height/2)

    let dx = (this.x - canvas.width/2)/dist
    let dy = (this.y - canvas.height/2)/dist

    let slope = stadium.getSlope(dist / (canvas.width/2))
    let g = 0.06

    this.sx += dx * slope * g
    this.sy += dy * slope * g

    let friction = Math.max(0.5, Math.min(Math.abs(this.spin) * 0.03, 0.95))
    this.sx *= friction
    this.sy *= friction

    this.x += this.sx
    this.y += this.sy

    //if(dist > stadium.radius*canvas.width/2) return "remove"

    let opacity = Math.min(1-(1/Math.abs(this.spin)/10), 0.7)

    let remove = opacity < 0.3
    let scale = remove ? stadium.scale : 1

    let tempCtx = remove ? stadium.ctx : fxCtx

    tempCtx.globalAlpha = Math.max(opacity, 0.3)
    drawRotatedImage(tempCtx, sprites[this.img], this.x*scale, this.y*scale, this.angle, this.radius*2*scale, this.radius*2*scale)
    tempCtx.globalAlpha = 1
    if(remove){
      return "remove"
    }
  }
}

function spraySparks(x, y, amount, angle, speed){
  for(let i = 0; i < amount; i++){
    let tempAngle = angle + (Math.random()-0.5) * Math.PI/4
    particles.push(new spark(x, y, tempAngle, speed * Math.random()))
  }
}

class spark {
  constructor(x, y, angle, speed){
    this.x = x
    this.y = y
    this.lx = x
    this.ly = y
    this.sx = Math.cos(angle) * speed
    this.sy = Math.sin(angle) * speed
    this.life = Math.random()*80+20
  }
  draw(){
    this.x += this.sx
    this.y += this.sy

    this.sx *= 0.98
    this.sy *= 0.98

    this.life -= 1
    if(this.life < 0) return "remove"
    
    fxCtx.lineWidth = 1
    let blue = 255*(Math.sqrt(this.life/100))
    fxCtx.strokeStyle = `rgb(255, 255, ${blue+30})`
    fxCtx.beginPath()
    fxCtx.moveTo(this.x, this.y)
    fxCtx.lineTo(this.lx, this.ly)
    fxCtx.stroke()

    this.lx = this.x
    this.ly = this.y
  }
}