let strandDensity = 40;
let flowAmplitude = 100;
let flowFrequency = 1.5;
let driftSpeed = 0.01;
let colorVariance = 60;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
}

function draw() {
  background(0, 0, 0);
  let time = frameCount * driftSpeed;

  for (let i = 0; i < strandDensity; i++) {
    let hue = (time * 10 + i * (colorVariance / strandDensity)) % 360;
    stroke(hue, 70, 90, 0.8);
    strokeWeight(1.5);

    beginShape();
    let yBase = map(i, 0, strandDensity - 1, height * 0.1, height * 0.9);

    // Add control points for smooth curves at the start and end
    // First control point
    let x_prev = -20;
    let noiseVal_prev = noise(x_prev * 0.005 * flowFrequency, time + i * 0.1);
    let yOffset_prev = sin(x_prev * 0.01 * flowFrequency + time) * flowAmplitude * 0.5;
    yOffset_prev += map(noiseVal_prev, 0, 1, -flowAmplitude * 0.5, flowAmplitude * 0.5);
    curveVertex(x_prev, yBase + yOffset_prev);

    // Actual points across the width
    for (let x = 0; x <= width; x += 10) {
      let noiseVal = noise(x * 0.005 * flowFrequency, time + i * 0.1);
      let yOffset = sin(x * 0.01 * flowFrequency + time) * flowAmplitude * 0.5;
      yOffset += map(noiseVal, 0, 1, -flowAmplitude * 0.5, flowAmplitude * 0.5);
      curveVertex(x, yBase + yOffset);
    }

    // Last control point
    let x_next = width + 20;
    let noiseVal_next = noise(x_next * 0.005 * flowFrequency, time + i * 0.1);
    let yOffset_next = sin(x_next * 0.01 * flowFrequency + time) * flowAmplitude * 0.5;
    yOffset_next += map(noiseVal_next, 0, 1, -flowAmplitude * 0.5, flowAmplitude * 0.5);
    curveVertex(x_next, yBase + yOffset_next);

    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}