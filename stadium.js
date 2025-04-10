let stadium = {
  scale: 2,
  radius: 0.93,
  canvas: undefined,
  ctx: undefined,
  markings: [],
  sampleDist: 0.01,
  antiCircling: 120,
  antiCirclingForce: 8,
  antiCirclingDrag: 0.1,
  type: 0,
  setup: function() {
    this.canvas = document.getElementById("stadium")
    this.ctx = this.canvas.getContext("2d")
  },
  details: function() {
    this.markings = []
    let canvasRadius = (this.canvas.width/2)
    for(let i = 0; i<10; i++){
      let size = 30 + Math.random() * 30

      let length = (0.15 + (1-(Math.random()**2)) * 0.85) * this.radius * canvasRadius - size
      let angle = Math.random() * 2 * Math.PI
      let x = canvasRadius + Math.cos(angle) * length
      let y = canvasRadius + Math.sin(angle) * length
      angle += (Math.random()-0.5) * Math.PI*0.25
      let img = `scratch${Math.floor(Math.random() * 3)}.png`
      let opacity = 0.1 + Math.random() * 0.2
      
      this.markings.push([img, x, y, angle, size, opacity])
    }
  },
  drawStadium: function() {
    this.type = parseInt(document.getElementById("stadiumType").value)

    let imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height)
    let data = imageData.data
    
    let canvasRadius = this.canvas.width/2

    for(let i = 0; i < data.length; i+=4) {
      let x = (i/4) % this.canvas.width
      let y = Math.floor((i/4) / this.canvas.width)
      let dist = distance(x+0.5, y+0.5, this.canvas.width/2, this.canvas.height/2)/canvasRadius

      let rgb = {r: 0, g: 0, b: 0}

      if(dist < this.radius){
        let value = 190 - Math.abs(this.getSlope(dist)*20)
        rgb.r = rgb.g = rgb.b = value
        data[i+3] = 255
      }else{
        rgb.r = 255
        rgb.g = 255
        rgb.b = 255
      }

      data[i] = rgb.r
      data[i+1] = rgb.g
      data[i+2] = rgb.b
    }
    this.ctx.putImageData(imageData, 0, 0)
    
    this.ctx.strokeStyle = "darkgray"
    this.ctx.lineWidth = 5
    this.ctx.beginPath()
    this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.radius * this.canvas.width/2, 0, Math.PI*2)
    this.ctx.stroke()

    for(let [img, x, y, angle, size, opacity] of this.markings){
      this.ctx.globalAlpha = opacity
      drawRotatedImage(this.ctx, sprites[img], x, y, angle, size, size)
      this.ctx.globalAlpha = 1
    }
  },
  getSlope: function(dist) { 
    let h1 = this.getHeight(dist-this.sampleDist/2)
    let h2 = this.getHeight(dist+this.sampleDist/2)
    
    let slope = (h1-h2)/this.sampleDist

    return slope
  },
  stadiumTypes: [
    (d) => d**3,
    (d) => ((1-Math.abs(Math.sin(d*Math.PI*2)))*0.08+Math.pow(d, 2)*0.92) * 1.4,
    (d) => 1 / (1 + Math.exp(-10 * (d - 0.5))),
    (d) => (1 - Math.abs(Math.sin(d * Math.PI * 0.5))) * d
  ],
  getHeight: function(dist) {
    return this.stadiumTypes[this.type](Math.max(dist, 0.001)/this.radius)
  }
}
