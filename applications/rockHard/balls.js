// --- Entity definitions ---
let entities = [
  {
    name: "Rock",
    color: [128, 128, 128],
    winsTo: [2],
    attractedToSame: false,
  },
  {
    name: "Paper",
    color: [255, 255, 255],
    winsTo: [0],
    attractedToSame: false,
  },
  {
    name: "Scissors",
    color: [255, 0, 0],
    winsTo: [1],
    attractedToSame: false,
  },
];

// Special non-RPS entities
let specialEntities = [
  {
    name: "Black Hole",
    color: [0, 0, 0],
    border: [128, 50, 0],
    winsTo: [0, 1, 2],
    damping: 0.5,
    sizeMultiplier: 5,
    massMultiplier: 1,
  },
];

let ballsAmount = 250;
let specialEntitiesAmount = 1;

let defaultDT = 1;
let defaultDTWon = 0.5;
let boostMultiplier = 5;

let preservedMassAmountOnCollision = 0.35;
let cursorMass = -5;
let cursorSpeedMass = -0.2;
let cursorClickMass = -1000;
let maxCursorMass = [-1000, 10];

// --- Canvas setup ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d", { alpha: true });
let W = (canvas.width = window.innerWidth);
let H = (canvas.height = window.innerHeight);
window.addEventListener("resize", () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

let balls = [];

function initBalls() {
  // normal RPS balls
  const entityLength = entities.length;
  const specialEntityLength = specialEntities.length;
  for (let i = 0; i < ballsAmount; i++) {
    const id = Math.floor(Math.random() * entityLength);

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

  // one stationary black hole in the center
  for (let i = 0; i < specialEntitiesAmount; i++) {
    const id = Math.floor(Math.random() * specialEntityLength);

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

/* Main drawBalls */
function drawBalls(now) {
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
    console.warn(cursorMass);
    toRemove.add(cursorBall);
    oldCursorPos.x = cursorPos.x;
    oldCursorPos.y = cursorPos.y;
  }

  // speed multiplier
  let dt = boost ? boostMultiplier * defaultDT : defaultDT;
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

  for (let i = 0; i < n; i++) {
    if (
      balls[i].id !== possibleIdWon &&
      won &&
      balls[i].id < entities.length &&
      balls[i].id >= 0
    )
      won = false;
    const bi = balls[i];
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

      // Rock-paper-scissors elimination on overlap (distance < minDist)
      if (distance < minDist) {
        let a = bi.id;
        let b = bj.id;

        if (a === b || a < 0 || b < 0) continue; // same type → normal collision later

        let winner = bj;
        let loser = bi;

        // Determine entity types
        const isISpecial = a >= entities.length;
        const isJSpecial = b >= entities.length;

        // Normalize IDs within their group
        const normA = isISpecial ? a - entities.length : a;
        const normB = isJSpecial ? b - entities.length : b;

        // Determine win conditions array
        const winsMatrix =
          isISpecial && isJSpecial
            ? specialEntities[normA]?.specialWinsTo
            : isISpecial
              ? specialEntities[normA]?.winsTo
              : isJSpecial
                ? entities[normA]?.specialWinsTo
                : entities[normA]?.winsTo;

        // Compare normalized IDs, not raw IDs
        if (winsMatrix?.includes(normB)) {
          winner = bi;
          loser = bj;
        } else if (winsMatrix?.includes(normA)) {
          winner = bj;
          loser = bi;
        }

        toRemove.add(loser);

        // Apply reward to winner

        winner.mass += loser.mass * preservedMassAmountOnCollision;
        winner.size = Math.cbrt(
          Math.max(0.1, winner.size ** 3 + loser.size ** 3 * 0.35),
        );

        // Apply small kick away from collision
        const nx = dx / (distance + 1e-9);
        const ny = dy / (distance + 1e-9);
        const kick = 0.6;
        winner.velX += (winner === bi ? -nx : nx) * kick;
        winner.velY += (winner === bi ? -ny : ny) * kick;
      }
    }
  }

  if (toRemove.size > 0) {
    balls = balls.filter((b) => !toRemove.has(b));
  }

  if (won && balls.length > 0) {
    boost = false;
    dt = defaultDTWon;

    // --- Save winner ID ---
    if (typeof window.savedWinnerId === "undefined") {
      window.savedWinnerId = possibleIdWon;
      console.log("🏆 Winner saved:", window.savedWinnerId);
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

    // fill first (core)
    sctx.fillStyle = `rgb(${b.color[0]}, ${b.color[1]}, ${b.color[2]})`;
    sctx.fill();

    // outline border (stronger & glowing if defined)
    if (b.border) {
      sctx.lineWidth = 2.5;
      sctx.strokeStyle = `rgb(${b.border[0]}, ${b.border[1]}, ${b.border[2]})`;
    } else {
      sctx.lineWidth = 1.5;
      sctx.strokeStyle = "rgba(255,255,255,0.25)";
    }
    sctx.stroke();
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
  requestAnimationFrame(drawBalls);
}

function showEndingMenu() {
  if (!endingMenu) return;
  const whoWon = window.savedWinnerId;

  if (speedUpToggle) {
    speedUpToggle.textContent = entities[whoWon].name;
  }

  header = endingMenu.querySelector("#header");

  if (whoWon === 0) {
    header.textContent = "Level Completed!";
  } else if (whoWon === 1) {
    header.textContent = "You Lost!";
  }
  endingMenu.classList.remove("hidden");
}

function startSimulation() {
  initBalls();

  window.addEventListener("mousemove", (e) => {
    cursorPos.x = e.clientX;
    cursorPos.y = e.clientY;
  });

  oldCursorPos.x = cursorPos.x;
  oldCursorPos.y = cursorPos.y;

  window.addEventListener("click", (e) => {
    hasClicked = true;
  });

  requestAnimationFrame(drawBalls);
}

startSimulation();
