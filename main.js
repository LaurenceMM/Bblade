let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

let fxC = document.getElementById("effects")
let fxCtx = fxC.getContext("2d")

let sprites = {}
let stat = {}

function setCanvSize(size) {
  canvas.width = size
  canvas.height = size
  fxC.width = size
  fxC.height = size

  stadium.canvas.width = size*stadium.scale
  stadium.canvas.height = size*stadium.scale
}

class beyC {
  constructor(x, y, radius, mass, spin, tipCircumference, type){
    this.x = x
    this.y = y
    this.sx = 0
    this.sy = 0
    this.radius = radius
    this.health = 20
    this.mass = mass
    this.spin = spin
    this.tipCircumference = tipCircumference
    this.tipFriction = 0.002
    this.trailFx = []

    this.ring = "none"
    this.type = type//["attack", "defence"][Math.floor(Math.random()*2)]

    this.skillData = {
      time: 60 * 20 * Math.random(),
      cycle: 0,
      dur: 0,
      color: ""
    }

    this.skillData.cycle = type == "attack"?60*10:60*10
    this.skillData.dur = type == "attack"?60:60*4
    this.skillData.color = type == "attack"?"red":"#3377ff"
    
    this.damadeMult = 1
    this.freezeSpin = false
    this.noKnockback = false
    this.invincible = false//Math.random() < 0.1?true:false

    this.layerImg = `la${Math.floor(Math.random()*3)}.png`
    this.boltImg = `bo${Math.floor(Math.random()*5)}.png`
    this.trackImg = `tr${Math.floor(Math.random()*4)}.png`
    this.tipImg = `ti${cap1stLetter(this.type)}.png`
  }
  die(){
    particles.push(new beyPartC(this.x, this.y, this.sx, this.sy, this.spin, this.tipImg, this.radius))
    particles.push(new beyPartC(this.x, this.y, this.sx, this.sy, this.spin, this.trackImg, this.radius))
    particles.push(new beyPartC(this.x, this.y, this.sx, this.sy, this.spin, this.layerImg, this.radius))
    particles.push(new beyPartC(this.x, this.y, this.sx, this.sy, this.spin, this.tipImg, this.radius))  

    return "dead"
  }
  findClosestBey() {
    let closestId = 0
    let closestDist = 100000
    for(let i = 0; i<beys.length; i++){
      let obj = beys[i]
      if(this === obj) continue

      let dist = distance(this.x, this.y, obj.x, obj.y)
      if(dist<closestDist){
        closestDist = dist
        closestId = i
      }
    }

    return closestId
  }
  skill() {
    this.skillData.time = Math.round(this.skillData.time)
    this.skillData.time--
    switch(this.type) {
      case "attack":
        if(this.skillData.time == this.skillData.dur) {
          //this.invincible = true
          this.damadeMult = 0.1
          this.noKnockback = true
          this.ring = "#f40"

          if(beys.length == 1) break
          let obj = beys[this.findClosestBey()]
          let dist = distance(obj.x, obj.y, this.x, this.y)
          let dx = (obj.x-this.x)/dist
          let dy = (obj.y-this.y)/dist
          
          let speed = distance(0, 0, this.sx, this.sy) + 2

          this.sx = dx * speed
          this.sy = dy * speed
        }
        if(this.skillData.time == this.skillData.dur/2){
          this.ring = this.skillData.color
          if(beys.length == 1) break
          let obj = beys[this.findClosestBey()]
          let dist = distance(obj.x, obj.y, this.x, this.y)
          let dx = (obj.x-this.x)/dist
          let dy = (obj.y-this.y)/dist
          
          let speed = distance(0, 0, this.sx, this.sy)

          this.sx = dx * speed
          this.sy = dy * speed
        }
        if(this.skillData.time <= 0){
          //this.invincible = false
          this.damadeMult = 1
          this.noKnockback = false
          this.skillData.time = this.skillData.cycle + (60*Math.random())
          this.ring = "none"
        }
        break
      case "defence":
        if(this.skillData.time == this.skillData.dur) {
          this.invincible = true
          this.noKnockback = true
          this.ring = this.skillData.color
        }
        if(this.skillData.time <= 0){
          this.invincible = false
          this.noKnockback = false
          this.skillData.time = this.skillData.cycle + (60*Math.random())
          this.ring = "none"
        }
        break
    }
  }
  move(){
    this.sx *= 0.97
    this.sy *= 0.97

    this.x += this.sx
    this.y += this.sy

    if(!this.freezeSpin) this.spin *= 0.9999

    if(this.health <= 0 || Math.abs(this.spin) < 10){
      return this.die()
    }
  }
  draw(){
    let angle = Math.PI*2 * Math.random()

    this.trailFx.unshift([this.x, this.y])
    if(this.trailFx.length > 10){
      this.trailFx.pop()
    }

    if(this.ring != "none"){
      fxCtx.strokeStyle = this.ring
      fxCtx.lineWidth = 1
      fxCtx.beginPath()
      fxCtx.arc(this.x, this.y, (this.radius + 2 + Math.sin(frame/10)/2), 0, Math.PI*2)
      fxCtx.stroke()
    }

    let skillMeter = Math.min(1, Math.max(0, (this.skillData.time-this.skillData.dur)/(this.skillData.cycle-this.skillData.dur)))

    fxCtx.globalAlpha = 0.3
    fxCtx.fillStyle = this.skillData.color
    drawBar(skillMeter, this.x-12/2, this.y + this.radius, 12, 2)
    //drawRadialBar(skillMeter, this.x, this.y, this.radius + 2)
    fxCtx.globalAlpha = 1

    //drawRotatedImage(ctx, sprites[this.tipImg], this.x, this.y, angle, this.radius*2, this.radius*2)
    //drawRotatedImage(ctx, sprites[this.trackImg], this.x, this.y, angle, this.radius*2, this.radius*2)
    drawRotatedImage(ctx, sprites[this.layerImg], this.x, this.y, angle, this.radius*2, this.radius*2)
    drawRotatedImage(ctx, sprites[this.boltImg], this.x, this.y, angle, this.radius*2, this.radius*2)
    
    let val = this.health/20
    if(val < 0.95){
      let width = 12
      let height = 2
      fxCtx.fillStyle = "red"
      drawBar(val, this.x-width/2, (this.y - this.radius)-height, width, height)
    }
    
    //ctx.fillStyle = "black"
    //ctx.fillText(Math.round(this.spin * 100)/100, this.x, this.y)

    this.drawTrail()
  }
  drawTrail(){
    fxCtx.strokeStyle = "white"
    fxCtx.fillStyle = "white"
    for (let i = 1; i < this.trailFx.length; i++) {
      let width = (10-i)/2
      let [fx, fy] = this.trailFx[i]     
      let [lfx, lfy] = this.trailFx[i-1]
      
      fxCtx.lineWidth = width
    
      fxCtx.beginPath()
      fxCtx.moveTo(fx, fy)
      fxCtx.lineTo(lfx, lfy)
      fxCtx.stroke()
    }
  }
  stadiumPhysics(multiplier){
    let dist = distance(this.x, this.y, canvas.width/2, canvas.height/2)
    
    let canvasRadius = (canvas.width/2) * stadium.radius

    let rad = canvasRadius - this.radius
    
    let angle = Math.atan2(canvas.height/2-this.y, canvas.width/2-this.x)

    if(dist > rad){
      let dx = -Math.cos(angle)
      let dy = -Math.sin(angle)
      let correction = rad - dist

      //spraySparks(canvas.width/2 + dx * rad, canvas.height/2 + dy * rad, Math.abs(this.spin/100), angle - Math.PI/2, this.spin*0.16)

      this.posCorrection(dx, dy, correction)
      this.applyForce(dx, dy, correction)
      
      if(stadium.antiCircling == 0){
        this.sx *= stadium.antiCirclingDrag
        this.sy *= stadium.antiCirclingDrag
        this.applyForce(dx, dy, -stadium.antiCirclingForce)
      }
    }

    dist /= canvasRadius
    let slope = stadium.getSlope(dist * stadium.radius)

    this.applyForce(Math.cos(angle), Math.sin(angle), -slope*0.003*multiplier*this.mass)

    slope -= 0.2

    angle -= Math.PI/2
    
    let force = this.tipCircumference*this.tipFriction*slope*this.spin/(this.mass/5)

    let [fx, fy] = normallizeVec(Math.cos(angle), Math.sin(angle))
    
    let [cx, cy] = normallizeVec(canvas.width/2-this.x, canvas.height/2-this.y)
    
    let d1 = distance(this.x, this.y, canvas.width/2, canvas.height/2)
    let d2 = distance(this.x + fx * force * multiplier, this.y + fy * force * multiplier, canvas.width/2, canvas.height/2)

    this.applyForce(fx, fy, force*multiplier)
    this.applyForce(cx, cy, (d2-d1)*10)//10
  }
  update(){
    for(let obj of beys){
      if(obj === this) continue
      
      let combinedRad = obj.radius + this.radius
      let dist = distance(this.x, this.y, obj.x, obj.y)
      let combinedMass = obj.mass + this.mass
      
      if(dist < combinedRad){
        let dx = (this.x-obj.x)/dist
        let dy = (this.y-obj.y)/dist
        let correction = combinedRad-dist
        
        let spinDiff = this.spin + obj.spin
        let hitStr = 0.01

        let impulse = (Math.abs(spinDiff)/(combinedMass*2)) + correction

        if(Math.abs(impulse) > 0.5 && !(this.invincible && obj.invincible)){
          let damage = Math.abs(impulse) * 0.5

          if(Math.random() < 0.5){
            this.invincible?obj.health -= damage * obj.damadeMult:this.health -= damage * this.damadeMult
          }else{
            obj.invincible?this.health -= damage * this.damadeMult:obj.health -= damage * obj.damadeMult
          }
        }
        
        let spx = this.x - dx * this.radius
        let spy = this.y - dy * this.radius
        
        let contAngle = Math.atan2(this.y - obj.y, this.x - obj.x)
        spraySparks(spx, spy, Math.abs(spinDiff/50), contAngle - Math.PI/2, (this.spin)*0.16)
        spraySparks(spx, spy, Math.abs(spinDiff/50), contAngle + Math.PI/2, (obj.spin)*0.16)

        if(!(this.freezeSpin || this.invincible)) this.spin -= spinDiff * (obj.mass/combinedMass) * hitStr * this.damadeMult
        this.posCorrection(dx, dy, correction*(obj.mass/combinedMass))
        if(!this.noKnockback) this.applyForce(dx, dy, impulse*(obj.mass/combinedMass))
        
        if(!(obj.freezeSpin || obj.invincible)) obj.spin -= spinDiff * (this.mass/combinedMass) * hitStr * obj.damadeMult
        obj.posCorrection(-dx, -dy, correction*(this.mass/combinedMass))
        if(!obj.noKnockback) obj.applyForce(-dx, -dy, impulse*(this.mass/combinedMass))
      }
    }
  }
  posCorrection(dx, dy, force){
    this.x += dx*force
    this.y += dy*force
  }
  applyForce(dx, dy, force){
    this.sx += dx*force
    this.sy += dy*force
  }
}

let beys = []
let particles = []

let frame = 0
let finaleFrames = 0

stadium.setup()

let running = false

setupScene()
async function setupScene() {
  setCanvSize(400) //300
  stadium.drawStadium()
  
  if(Object.keys(sprites).length === 0){
    sprites = await loadImages(['la0.png', 'la1.png', 'la2.png', 'bo0.png', 'bo1.png', 'bo2.png', 'bo3.png', 'bo4.png', 'tr0.png', 'tr1.png', 'tr2.png', 'tr3.png', 'tiAttack.png', 'tiDefence.png'], "sprites/")
  }
  
  particles = []

  beys = []
  for (let i = 0; i < 6; i++) {//6
    let type = ["attack", "defence"][Math.floor(Math.random()*2)]//["attack", "defence"][i%2]
    
    let radius, tipCircumference
    if(type == "attack"){
      radius = 3 * Math.random() + 5
      tipCircumference = Math.random() * 0.05 + 0.1
    }else{
      radius = 5 * Math.random() + 5
      tipCircumference = Math.random() * 0.05 + 0.03
    }

    let spin = 100 * (Math.random()<0.95?1:-1)
    let mass = radius

    let angle = Math.PI*2 * Math.random()
    let x = canvas.width/2 + Math.cos(angle) * (canvas.width*stadium.radius/2 - radius - 5)
    let y = canvas.height/2 + Math.sin(angle) * (canvas.width*stadium.radius/2 - radius - 5)
    
    beys.push(new beyC(x, y, radius, mass, spin, tipCircumference, type))
  }
  
  if(!running) {gameLoop();running = true}
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  fxCtx.clearRect(0, 0, canvas.width, canvas.height)

  let simSpeed = parseFloat(document.getElementById("simSpeed").value)
  
  for(let i = 0; i<simSpeed; i++){
    logic(i)
    frame++
    if(beys.length <= 1) finaleFrames++ 
  }

  //console.log(beys[0].x, beys[0].y, beys[0].sx, beys[0].sy)
  
  if(finaleFrames > 60 * 5){
    let type = beys[0]?.type || "tie"
    if(stat[type] == undefined) stat[type] = 0
    stat[type]++
    finaleFrames = 0
    console.log(stat)
    setupScene()
  }

  window.requestAnimationFrame(gameLoop)
}

function logic(pass) {
  
  stadium.antiCircling--
  if(stadium.antiCircling < 0){
    stadium.antiCircling = 120
  }
  fxCtx.strokeStyle = "yellow"
  fxCtx.lineWidth = 2
  fxCtx.beginPath()
  fxCtx.arc(canvas.width/2, canvas.height/2, (canvas.width/2) * stadium.radius + (1-(stadium.antiCircling/120)**5) * 8, 0, Math.PI*2)
  fxCtx.stroke()

  for(const obj of beys){
    obj.update()
  }
  for(let i = 0; i<beys.length; i++){
    let obj = beys[i]
    obj.stadiumPhysics(4)//3
    
    obj.skill()

    if(obj.move() == "dead"){
      beys.splice(i, 1)
      i--
    }else{
      if(pass == 0) obj.draw()
    }
  }
  
  //if(pass != 0) return
  for (let i = 0; i < particles.length; i++) {
    let obj = particles[i]
    if(obj.draw() == "remove"){
      particles.splice(i, 1)
      i--
    }
  }
}