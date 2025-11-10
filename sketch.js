let osc, fft;

let notes = [
  { name: "C", freq: 261.6256, black: false },
  { name: "C#", freq: 277.1826, black: true },
  { name: "D", freq: 293.6648, black: false },
  { name: "D#", freq: 311.127, black: true },
  { name: "E", freq: 329.6276, black: false },
  { name: "F", freq: 349.2282, black: false },
  { name: "F#", freq: 369.9944, black: true },
  { name: "G", freq: 391.9954, black: false },
  { name: "G#", freq: 415.3047, black: true },
  { name: "A", freq: 440.0, black: false },
  { name: "A#", freq: 466.1638, black: true },
  { name: "B", freq: 493.8833, black: false },
  { name: "C5", freq: 523.2511, black: false },
];

function setup() {
  let cnv = createCanvas(700, 250);
  cnv.mousePressed(startSound);
  osc = new p5.Oscillator("sine");
  osc.amp(0);
  fft = new p5.FFT();
  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(220);

  let whiteKeys = notes.filter((n) => !n.black);
  let keyWidth = width / whiteKeys.length;
  let currentNote = null;

  let index = floor(map(mouseX, 0, width, 0, notes.length));
  index = constrain(index, 0, notes.length - 1);
  currentNote = notes[index];
  osc.freq(currentNote.freq);

  let whiteIndex = 0;
  for (let i = 0; i < notes.length; i++) {
    if (!notes[i].black) {
      let x = whiteIndex * keyWidth;
      fill(notes[i] === currentNote ? 200 : 255);
      stroke(0);
      rect(x, 0, keyWidth, 120);
      fill(0);
      text(notes[i].name, x + keyWidth / 2, 100);
      whiteIndex++;
    }
  }

  whiteIndex = 0;
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].black) {
      let x = (whiteIndex - 0.5) * keyWidth;
      fill(notes[i] === currentNote ? 80 : 0);
      noStroke();
      rect(x, 0, keyWidth * 0.6, 70);
    } else {
      whiteIndex++;
    }
  }

  let spectrum = fft.analyze();
  noStroke();
  fill(255, 0, 255);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }

  fill(0);
  if (!osc.started) {
    text("화면 클릭 시 사운드 시작", width / 2, 160);
  } else {
    text(
      currentNote.name + " (" + currentNote.freq.toFixed(1) + " Hz)",
      width / 2,
      160
    );
  }
}

function startSound() {
  osc.start();
  osc.amp(0.5, 0.2);
}

function mouseReleased() {
  osc.amp(0, 0.2);
}
