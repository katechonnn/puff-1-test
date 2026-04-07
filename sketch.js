// ─── V1: PASTEL BLOOM ────────────────────────────────────────────────────────
// Rotating petal ellipses bloom outward on click.
// Paste into editor.p5js.org and run.
 
const WORD        = "CLUMSY";
const SAMPLE_STEP = 7;
const HUES        = [350, 18, 200, 280, 140, 55, 330, 170];
 
let pts       = [];
let inflation = 0;
let dir       = 0;
 
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  angleMode(RADIANS);
  sampleText();
}
 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sampleText();
}
 
function sampleText() {
  const W  = windowWidth;
  const H  = windowHeight;
  const sz = min(W / (WORD.length * 0.72), 175);
 
  const c      = document.createElement('canvas');
  c.width      = W;
  c.height     = H;
  const ctx    = c.getContext('2d');
  ctx.fillStyle     = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle     = '#fff';
  ctx.font          = `bold ${sz}px Georgia, serif`;
  ctx.textAlign     = 'center';
  ctx.textBaseline  = 'middle';
  ctx.fillText(WORD, W / 2, H / 2);
 
  const px = ctx.getImageData(0, 0, W, H).data;
  pts = [];
 
  for (let x = 0; x < W; x += SAMPLE_STEP) {
    for (let y = 0; y < H; y += SAMPLE_STEP) {
      const i = (x + y * W) * 4;
      if (px[i] > 128) {
        pts.push({
          x:         x - W / 2,
          y:         y - H / 2,
          baseR:     random(4, 11),
          hue:       random(HUES),
          phase:     random(TWO_PI),
          spinRate:  random(-1, 1),
          wobbleAmp: random(0.08, 0.25),
        });
      }
    }
  }
}
 
function mousePressed() {
  if (dir === 0) dir = 1;
}
 
function updateInflation() {
  const dt = deltaTime / 1000;
  if (dir === 1) {
    inflation = min(inflation + dt * 0.85, 1);
    if (inflation >= 1) dir = -1;
  } else if (dir === -1) {
    inflation = max(inflation - dt * 0.5, 0);
    if (inflation <= 0) dir = 0;
  }
}
 
function ease(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
 
function draw() {
  updateInflation();
 
  background(33, 22, 97);
  translate(width / 2, height / 2);
 
  const inf = ease(inflation);
  const t   = frameCount * 0.018;
 
  for (const p of pts) {
    const wobble = sin(t + p.phase) * p.wobbleAmp * (1 - inf * 0.4);
    const rot    = p.spinRate * inf * PI + wobble;
    const rW     = p.baseR * (1 + inf * 2.6) * 2;
    const rH     = p.baseR * (1 + inf * 0.45) * 2;
 
    push();
    translate(p.x, p.y);
    rotate(rot);
    noStroke();
 
    // soft shadow petal
    fill(p.hue, 30 + inf * 20, 75 - inf * 10, 25);
    ellipse(2, 3, rW * 1.05, rH * 1.05);
 
    // main petal
    fill(p.hue, 38 + inf * 28, 96 - inf * 8, 88);
    ellipse(0, 0, rW, rH);
 
    // sheen highlight
    fill((p.hue + 30) % 360, 12, 100, 35);
    ellipse(-rW * 0.12, -rH * 0.15, rW * 0.38, rH * 0.38);
 
    pop();
  }
 
  // hint text
  if (inf < 0.02 && dir === 0) {
    noStroke();
    fill(25, 35, 40, abs(sin(frameCount * 0.03)) * 90);
    textAlign(CENTER, CENTER);
    textSize(11);
    textFont('Courier New');
    text('CLICK TO INFLATE', 0, height * 0.38);
  }
}