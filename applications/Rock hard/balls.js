let entities = [];
let specialEntities = [];

let defaultDT = 1;
let defaultDTWon = 0.5;
let boostMultiplier = 5;

let preservedMassAmountOnCollision = 0.35;

let cursorMass = -5;
let cursorSpeedMass = -0.2;
let cursorClickMass = -1000;
let maxCursorMass = [-1000, 10];
let cursorClickCooldown_ms = 2000;
let cursorClickTime = null;

let playerBallID = 0;

let showNames = false;

function slowDownSimulation() {
  defaultDT = 0.2;
  defaultDTWon = 0;
}

function defaultSpeedSimulation() {
  defaultDT = 1;
  defaultDTWon = 0.5;
}

// --- Canvas setup ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d", { alpha: true });
let W = (canvas.width = window.innerWidth);
let H = (canvas.height = window.innerHeight);
window.addEventListener("resize", () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

let dt = defaultDT;
let balls = [];
let stop = false;
let ended = false;
let showEndingScreen = true;
let startedSimulation = false;
let coolDownTimeOnStart = 0;

function initBalls() {
  // normal RPS balls
  const entityLength = entities.length;
  const specialEntityLength = specialEntities.length;
  for (let id = 0; id < entityLength; id++) {
    if (!entities[id] || typeof entities[id] !== 'object') continue;
    const amountOfEntity = entities[id].amount ?? 0;
    for (let j = 0; j < amountOfEntity; j++) {
      const sizeMultiplier = entities[id].sizeMultiplier ?? 1;
      const massMultiplier = entities[id].massMultiplier ?? 1;

      const size = (Math.random() * 2 + 6) * sizeMultiplier;
      const mass = size * size * 0.1 * massMultiplier;

      const damping = entities[id].damping ?? 0.995;

      balls.push({
        x: Math.random() * W,
        y: Math.random() * H,
        velX: (Math.random() - 0.5) * 0.8,
        velY: (Math.random() - 0.5) * 0.8,
        color: entities[id].color,
        border: entities[id].border,
        size,
        mass,
        id,
        damping,
        atractedToSame: entities[id].attractedToSame ?? true,
      });
    }
  }

  // one stationary black hole in the center
  for (let id = 0; id < specialEntityLength; id++) {
    if (!specialEntities[id] || typeof specialEntities[id] !== 'object') continue;
    const amountOfEntity = specialEntities[id].amount ?? 0;
    for (let j = 0; j < amountOfEntity; j++) {
      const sizeMultiplier = specialEntities[id].sizeMultiplier ?? 1;
      const massMultiplier = specialEntities[id].massMultiplier ?? 1;

      const size = (Math.random() * 2 + 6) * sizeMultiplier;
      const mass = size * size * 0.1 * massMultiplier;

      const damping = specialEntities[id].damping ?? 0.995;

      balls.push({
        x: Math.random() * W,
        y: Math.random() * H,
        velX: (Math.random() - 0.5) * 0.8,
        velY: (Math.random() - 0.5) * 0.8,
        color: specialEntities[id].color,
        border: specialEntities[id].border,
        size,
        mass,
        id: id + entityLength,
        damping,
        atractedToSame: specialEntities[id].attractedToSame ?? true,
      });
    }
  }
}

let boost = false;

let oldCursorPos = { x: 0, y: 0 };
let cursorPos = { x: 0, y: 0 };
let hasClicked = false;

const speedUpToggle = document.getElementById("toggleBoost");

if (speedUpToggle) {
  speedUpToggle.addEventListener("click", () => {
    if (typeof window.savedWinnerId === "undefined") {
      boost = !boost;
      speedUpToggle.classList.toggle("active", boost);
      speedUpToggle.textContent = `Speed up: ${boost ? "ON" : "OFF"}`;
    }
  });

  speedUpToggle.textContent = `Speed up: ${boost ? "ON" : "OFF"}`;
}

const endingMenu = document.getElementById("endingMenu");

/* Offscreen canvas for postprocessing */
const scene = document.createElement("canvas");
const sctx = scene.getContext("2d");
scene.width = W;
scene.height = H;

/* Tunables */
let baseSoftening = 4;
let lastTime = 0;

/* Main drawBalls */
function drawBalls(timestamp) {
  if (stop) {
    stop = false;
    return;
  }

  const toRemove = new Set();
  if (oldCursorPos !== cursorPos) {
    let cursorRealMass =
      (Math.abs(oldCursorPos.x - cursorPos.x) +
        Math.abs(oldCursorPos.y - cursorPos.y)) *
        cursorSpeedMass +
      cursorMass;

    if (hasClicked) {
      cursorRealMass += cursorClickMass;
      hasClicked = false;
    }

    cursorRealMass = Math.max(
      maxCursorMass[0],
      Math.min(cursorRealMass, maxCursorMass[1]),
    );
    const cursorBall = {
      x: cursorPos.x,
      y: cursorPos.y,
      velX: 0,
      velY: 0,
      color: [0, 0, 0],
      size: 1e-6,
      mass: cursorRealMass,
      id: -1,
      damping: 0,
      atractedToSame: false,
    };

    balls.push(cursorBall);
    toRemove.add(cursorBall);
    oldCursorPos.x = cursorPos.x;
    oldCursorPos.y = cursorPos.y;
  }

  // speed multiplier
  if (!lastTime) lastTime = timestamp;
  let time = (timestamp - lastTime) / 16.6;
  lastTime = timestamp;

  dt = ended ? defaultDTWon : boost ? boostMultiplier * defaultDT : defaultDT;
  dt *= time
  const softening = baseSoftening;

  // prepare scene canvas size (in case of resize)
  if (scene.width !== W || scene.height !== H) {
    scene.width = W;
    scene.height = H;
  }

  let n = balls.length;

  const ax = new Float32Array(n);
  const ay = new Float32Array(n);

  // --- Gravity & RPS elimination (pairwise) ---
  let won = true;
  let possibleIdWon = balls[0].id;

  let lost = true;

  for (let i = 0; i < n; i++) {
    const bi = balls[i];
    const biID = bi.id
    
    if (
      biID !== possibleIdWon &&
      won &&
      biID < entities.length &&
      biID >= 0
    ) {
      won = false;
      possibleIdWon = -1;
    }

    if (lost && biID === playerBallID ) {
      lost = false;
    }
      
    
    const attractedToSameType = bi.atractedToSame;
    for (let j = i + 1; j < n; j++) {
      const bj = balls[j];
      if (!attractedToSameType && bj.id === bi.id) {
        continue;
      }
      let dx = bj.x - bi.x;
      let dy = bj.y - bi.y;
      let distSq = dx * dx + dy * dy;

      if (distSq < 1e-6) continue;

      const distance = Math.sqrt(distSq);
      const minDist = bi.size + bj.size;

      // gravity-like attraction (softened)
      const force = (bi.mass * bj.mass) / (distSq + softening);
      const fx = (force * dx) / (distance + 1e-9);
      const fy = (force * dy) / (distance + 1e-9);

      ax[i] += fx / bi.mass;
      ay[i] += fy / bi.mass;
      ax[j] -= fx / bj.mass;
      ay[j] -= fy / bj.mass;

      // elimination on overlap
      if (distance <= minDist) {
        // implement collision
        for (let i = 0; i < 2; i++) {
          // Apply small kick away from collision
          const nx = dx / (distance + 1e-9);
          const ny = dy / (distance + 1e-9);
          const kick = 1;

          if (i === 0) {
            bi.velX += -nx * kick / bi.mass;
            bi.velY += -ny * kick / bi.mass;
          } else {
            bj.velX += nx * kick / bj.mass;
            bj.velY += ny * kick / bj.mass;
          }
        }

        let a = biID;
        let b = bj.id;

        if (a < 0 || b < 0) continue; // non entity

        let winner;
        let loser = [];

        // Determine entity types
        const isASpecial = a >= entities.length;
        const isBSpecial = b >= entities.length;

        // Normalize IDs within their group
        const normA = isASpecial ? a - entities.length : a;
        const normB = isBSpecial ? b - entities.length : b;

        const winsMatrixA = isASpecial
          ? isBSpecial ? specialEntities[normA]?.specialWinsTo : specialEntities[normA]?.winsTo
          : isBSpecial ? entities[normA]?.specialWinsTo : entities[normA]?.winsTo

        const winsMatrixB = isBSpecial
          ? isASpecial ? specialEntities[normB]?.specialWinsTo : specialEntities[normB]?.winsTo
          : isASpecial ? entities[normB]?.specialWinsTo : entities[normB]?.winsTo

        // Only consider as valid if the winsTo array actually has elements
        const aHasValidWins = Array.isArray(winsMatrixA) && winsMatrixA.length > 0;
        const bHasValidWins = Array.isArray(winsMatrixB) && winsMatrixB.length > 0;

        if (aHasValidWins && winsMatrixA.includes(normB)) {
          winner = bi;
          loser.push(bj);
        } 
        if (bHasValidWins && winsMatrixB.includes(normA)) {
          winner = bj;
          loser.push(bi);
        }

        
        if (loser.length > 0) {
          for (let l = 0; l < loser.length; l++) {
            toRemove.add(loser[l]);
          }
        }

        if (winner) {
          // Apply reward to winner
          winner.mass += loser[0].mass * preservedMassAmountOnCollision;
          winner.size = Math.cbrt(
            Math.max(0.1, winner.size ** 3 + loser[0].size ** 3 * 0.35),
          );
        }
      }
    }
  }

  if (toRemove.size > 0) {
    balls = balls.filter((b) => !toRemove.has(b));
  }

  if ((won || lost && showEndingScreen)) {
    boost = false;
    ended = true;

    // --- Save winner ID ---
    if (window.savedWinnerId !== possibleIdWon) {
      window.savedWinnerId = possibleIdWon;
      console.log("Winner:", window.savedWinnerId);
      showEndingMenu();
    }
  }

  // update n after removals
  n = balls.length;

  // --- Integrate motion ---
  for (let i = 0; i < n; i++) {
    const b = balls[i];
    const damping = b.damping;

    // apply accelerations with dt and damping
    b.velX += ax[i] * dt;
    b.velY += ay[i] * dt;

    b.velX *= damping;
    b.velY *= damping;

    b.x += b.velX * dt;
    b.y += b.velY * dt;

    // wall bounce
    if (b.x < b.size) {
      b.x = b.size;
      b.velX *= -0.8;
    } else if (b.x > W - b.size) {
      b.x = W - b.size;
      b.velX *= -0.8;
    }
    if (b.y < b.size) {
      b.y = b.size;
      b.velY *= -0.8;
    } else if (b.y > H - b.size) {
      b.y = H - b.size;
      b.velY *= -0.8;
    }
  }

  // --- Collision impulse + positional correction ---
  for (let i = 0; i < n; i++) {
    const bi = balls[i];
    for (let j = i + 1; j < n; j++) {
      const bj = balls[j];
      let dx = bj.x - bi.x;
      let dy = bj.y - bi.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = bi.size + bj.size;

      if (dist === 0) {
        dx = (Math.random() - 0.5) * 0.01;
        dy = (Math.random() - 0.5) * 0.01;
        dist = Math.sqrt(dx * dx + dy * dy);
      }

      if (dist < minDist) {
        const nx = dx / dist;
        const ny = dy / dist;

        // relative velocity along normal
        const rvx = bi.velX - bj.velX;
        const rvy = bi.velY - bj.velY;
        const relVel = rvx * nx + rvy * ny;

        if (relVel < 0) {
          const e = 0.9;
          const invMassSum = 1 / bi.mass + 1 / bj.mass;
          const jImpulse = (-(1 + e) * relVel) / invMassSum;
          const impulseX = jImpulse * nx;
          const impulseY = jImpulse * ny;
          bi.velX += impulseX / bi.mass;
          bi.velY += impulseY / bi.mass;
          bj.velX -= impulseX / bj.mass;
          bj.velY -= impulseY / bj.mass;
        }

        // positional correction
        const percent = 0.8;
        const slop = 0.01;
        const overlap = Math.max(minDist - dist - slop, 0);
        if (overlap > 0) {
          const correction = (overlap / (1 / bi.mass + 1 / bj.mass)) * percent;
          const correctionX = correction * nx;
          const correctionY = correction * ny;
          bi.x -= correctionX * (1 / bi.mass);
          bi.y -= correctionY * (1 / bi.mass);
          bj.x += correctionX * (1 / bj.mass);
          bj.y += correctionY * (1 / bj.mass);
        }
      }
    }
  }

  // --- Draw scene to offscreen canvas ---
  sctx.clearRect(0, 0, W, H);

  // optional subtle background glow
  sctx.fillStyle = "rgba(6, 8, 10, 0.35)";
  sctx.fillRect(0, 0, W, H);

  // Draw entities with visible borders
  for (const b of balls) {
    sctx.beginPath();
    sctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);

    // Determine entity types
    const isSpecial = b.id >= entities.length;
    const id = isSpecial ? b.id - entities.length : b.id;

    // fill first (core)
    sctx.fillStyle = `rgb(${b.color[0]}, ${b.color[1]}, ${b.color[2]})`;
    sctx.fill();

    // outline border (stronger & glowing if defined)
    if (b.border) {
      sctx.lineWidth = b.borderSize || 2.5;
      sctx.strokeStyle = `rgb(${b.border[0]}, ${b.border[1]}, ${b.border[2]})`;
    } else {
      sctx.lineWidth = 1.5;
      sctx.strokeStyle = "rgba(255,255,255,0.25)";
    }
    sctx.stroke();

    // --- draw name if enabled ---
    if (showNames) {
      const name = isSpecial ? specialEntities[id].name : entities[id].name
      sctx.font = `${Math.max(10, b.size)}px "Jersey 15"`; // font scales with size
      sctx.fillStyle = "white";
      sctx.textAlign = "center";
      sctx.textBaseline = "bottom";
      if (b.y > b.size * 2) {
        sctx.fillText(name, b.x, b.y - b.size - 2);
      } else {
        sctx.fillText(name, b.x, b.y + b.size * 2 + 4);
      }
    }
  }

  // --- Postprocess & composite to main canvas ---
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(scene, 0, 0);

  // --- Add scanlines ---
  const linesAlpha = 0.18;
  ctx.fillStyle = `rgba(0,0,0,${linesAlpha})`;
  for (let y = 0; y < H; y += 2) {
    ctx.fillRect(0, y, W, 1);
  }

  if (boost) {
    // --- Add subtle vignette ---
    const g = ctx.createRadialGradient(
      W / 2,
      H / 2,
      Math.min(W, H) * 0.45,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.85,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.8)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // loop
  if (startedSimulation && coolDownTimeOnStart !== 0) {
    startedSimulation = false;
    setTimeout(() => {
      requestAnimationFrame(drawBalls);
    },coolDownTimeOnStart);
  } else {
    requestAnimationFrame(drawBalls);
  }
}

function showEndingMenu() {
  if (!endingMenu || !showEndingScreen) return;
  const whoWon = window.savedWinnerId;
  endingMenu.style.display = "block";

  header = endingMenu.querySelector("#header");

  if (whoWon === playerBallID) {
    header.textContent = "Round Completed!";
  } else {
    header.textContent = "You Lost!";
  }
  endingMenu.classList.remove("hidden");
}

const cooldownCircle = document.getElementById("cooldownCircle");
const cooldownText = document.getElementById("cooldownText");
let cooldownRing = null;
let totalCircumference = 0;

function setupCooldownRing() {
  // Get container size
  const size = cooldownCircle.offsetHeight; // or getBoundingClientRect().height
  const strokeWidth = Math.min(0, parseFloat(
    getComputedStyle(cooldownCircle).getPropertyValue("--circle-border")
  ) );

  const radius = size / 2 - strokeWidth / 2;

  // Create SVG elements dynamically
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.classList.add("cooldownRing");

  progressCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  progressCircle.classList.add("ring-progress");
  progressCircle.setAttribute("cx", size / 2);
  progressCircle.setAttribute("cy", size / 2);
  progressCircle.setAttribute("r", radius);
  progressCircle.setAttribute("stroke-width", strokeWidth);

  cooldownRing = progressCircle;
  svg.append(progressCircle);
  cooldownCircle.appendChild(svg);

  // Compute circumference dynamically
  totalCircumference = 2 * Math.PI * (radius * 1.05);
  progressCircle.style.strokeDasharray = totalCircumference;
  progressCircle.style.strokeDashoffset = totalCircumference;
}

function updateCooldown() {
  if (!cursorClickTime) {
    requestAnimationFrame(updateCooldown);
    return;
  }
  const now = Date.now();
  const elapsed = now - cursorClickTime;
  const remaining = Math.max(0, cursorClickCooldown_ms - elapsed);
  const fraction = remaining / cursorClickCooldown_ms;

  if (remaining > 0) {
    cooldownText.textContent = (remaining / 1000).toFixed(1);
    cooldownRing.style.strokeDashoffset = totalCircumference * fraction;
    cooldownCircle.classList.remove("hidden");
  } else {
    cooldownText.textContent = "0.0";
    cooldownRing.style.strokeDashoffset = totalCircumference;
    cooldownCircle.classList.add("hidden");
  }

  requestAnimationFrame(updateCooldown);
}

function startCooldown() {
  if (cooldownCircle) {
    setupCooldownRing();
    updateCooldown();
  }
}

function startSimulation(isGamePlay = true, cooldownTime_ms = 500) {
  balls = [];
  showEndingScreen = isGamePlay;
  if (isGamePlay) {
    startedSimulation = true;
    coolDownTimeOnStart = cooldownTime_ms;
  }

  ended = false;
  window.savedWinnerId = undefined;
  initBalls();

  oldCursorPos.x = cursorPos.x;
  oldCursorPos.y = cursorPos.y;

  if (speedUpToggle) {
    speedUpToggle.textContent = `Speed up: ${boost ? "ON" : "OFF"}`;
  }

  startCooldown();
  requestAnimationFrame(drawBalls);
}

window.addEventListener("mousemove", (e) => {
  cursorPos.x = e.clientX;
  cursorPos.y = e.clientY;
});

canvas.addEventListener("click", (e) => {
  if (
    Date.now() - cursorClickTime >= cursorClickCooldown_ms ||
    !cursorClickTime
  ) {
    hasClicked = true;
    cursorClickTime = Date.now();
  }
});

window.addEventListener("keypress", (e) => {
    if (e.key === "n") {
      showNames = !showNames;
    }
  })

function stopSimulation() {
  balls = [];
  stop = true;
  startedSimulation = false;
  cooldownTime_ms = 0;
}
