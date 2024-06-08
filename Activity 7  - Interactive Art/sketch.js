let particles = [];
const num = 10000;
const scaleFactor = 0.01;
const speed = 0.4;
let welcomeTextDisplayed = false;
let textColor;
let letters = [];
let customFont;

function preload() {
  // Load the custom font
  customFont = loadFont('fonts/Jaro-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255);
  textColor = color(255); // Default text color is white
  textFont(customFont); // Set the custom font
  for (let i = 0; i < num; i++) {
    let vector = createVector(random(width), random(height));
    particles.push(vector);
  }
}

function draw() {
  background(0); // Match background color of provided flow field
  for (let i = 0; i < num; i++) {
    let p = particles[i];
    point(p.x, p.y);

    let n = noise(p.x * scaleFactor, p.y * scaleFactor);
    // TAU is 2 * PI
    // multiply by 2 to prevent perlin bias
    let a = 2 * TWO_PI * n;
    
    // bias to the left as perlin clumps around 0.5
    p.x += cos(a) * speed;
    p.y += sin(a) * speed;

    if (!onScreen(p)) {
      p.x = random(width);
      p.y = random(height);
    }
  }

  // Update and display the letters
  for (let letter of letters) {
    letter.update();
    letter.display();
  }

  // Display the welcome text if activated and there are no floating letters
  if (welcomeTextDisplayed && letters.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(35);
    fill(textColor);
    text("Welcome to Bath Spa University", width / 2, height / 2);
  }
}

function mousePressed(e) {
  // Change text color randomly
  textColor = color(random(255), random(255), random(255));
  
  // Display the normal text when mouse is pressed
  welcomeTextDisplayed = true;
  letters = []; // Clear floating letters
}

function keyPressed() {
  // Change text color and display the floating letters when space bar is pressed
  if (keyCode === 32) { // 32 is the keyCode for space bar
    textColor = color(random(255), random(255), random(255)); // Random RGB color
    welcomeTextDisplayed = false; // Hide the normal text
    spreadLetters(); // Spread the floating letters
  }
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

function spreadLetters() {
  letters = [];
  let message = "Bath Spa University";
  textAlign(CENTER, CENTER);
  textSize(30);
  for (let i = 0; i < message.length; i++) {
    let letterX = random(width);
    let letterY = random(height);
    let vx = random(-2, 2);
    let vy = random(-2, 2);
    let letter = new Letter(letterX, letterY, message[i], vx, vy);
    letters.push(letter);
  }
}

class Letter {
  constructor(x, y, char, vx, vy) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  display() {
    fill(textColor);
    text(this.char, this.x, this.y);
  }
}
