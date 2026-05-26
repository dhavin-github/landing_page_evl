/* ==========================================================================
   EVL - ETERNIA VOLLEYBALL LEAGUE MONSOON SMASH PREMIUM JS ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize premium interactive systems
  initHeaderScroll();
  initSplashParticles();
  initHeroArtworkTilt();
  initTelemetryCharts();
  initRosterRoleSelection();
  initCountdownTimer();
  initNewsletterSubmit();

});

/* ==========================================
   1. HEADER SCROLL EFFECT
   ========================================== */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/* ==========================================
   2. BACKGROUND INTERACTIVE BUBBLE SPLASHES
   ========================================== */
function initSplashParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  // Resize listener
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  // Cursor tracker
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Fluid bubble particles
  class SplashBubble {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      // Electric Blue or Soft Orange
      this.color = Math.random() > 0.4 
        ? 'rgba(0, 240, 255, ' + (Math.random() * 0.2 + 0.05) + ')' 
        : 'rgba(255, 93, 0, ' + (Math.random() * 0.15 + 0.05) + ')';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around bounds
      if (this.x < 0) this.x = w;
      if (this.x > w) this.x = 0;
      if (this.y < 0) this.y = h;
      if (this.y > h) this.y = 0;

      // Hydrodynamic cursor push
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          
          this.x += directionX * force * 0.7;
          this.y += directionY * force * 0.7;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = this.color.includes('255, 93') ? '#ff5d00' : '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  // Populate bubble array
  const particleCount = Math.min(50, Math.floor((w * h) / 28000));
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new SplashBubble());
  }

  // Animation draw loops
  function drawFrame() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(drawFrame);
  }

  drawFrame();
}

/* ==========================================
   3. HERO CHAMPIONSHIP SHIELD TILT PARALLAX
   ========================================== */
function initHeroArtworkTilt() {
  const frame = document.getElementById('hero-artwork-frame');
  if (!frame) return;

  frame.addEventListener('mousemove', (e) => {
    const box = frame.getBoundingClientRect();
    const cursorX = e.clientX - box.left - box.width / 2;
    const cursorY = e.clientY - box.top - box.height / 2;
    
    // Tilt limit degrees
    const angleX = (cursorY / (box.height / 2)) * -7;
    const angleY = (cursorX / (box.width / 2)) * 7;

    frame.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
    frame.style.transition = 'transform 0.1s ease-out';
  });

  frame.addEventListener('mouseleave', () => {
    frame.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    frame.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  });
}

/* ==========================================
   4. TOURNAMENT TELEMETRY CANVAS CHARTS
   ========================================== */
function initTelemetryCharts() {
  const canvas = document.getElementById('telemetry-canvas');
  const dataSelect = document.getElementById('telemetry-data-select');
  const statPeak = document.getElementById('t-stat-peak');
  const statAvg = document.getElementById('t-stat-avg');
  const statLbl1 = document.getElementById('t-stat-lbl-1');
  const statLbl2 = document.getElementById('t-stat-lbl-2');

  if (!canvas || !dataSelect) return;

  const ctx = canvas.getContext('2d');

  // Chart datasets
  const dataStreams = {
    spike: {
      peak: '136.2 km/h',
      avg: '118.4 km/h',
      lbl1: 'Max Spike Speed',
      lbl2: 'Average Velocity',
      lineColor: '#00f0ff', // electric blue
      glowColor: 'rgba(0, 240, 255, 0.3)',
      points: [60, 85, 110, 95, 122, 105, 136, 115, 128]
    },
    leap: {
      peak: '362 cm',
      avg: '338 cm',
      lbl1: 'Peak Jump Reach',
      lbl2: 'Roster Average',
      lineColor: '#ff5d00', // orange
      glowColor: 'rgba(255, 93, 0, 0.3)',
      points: [310, 325, 342, 330, 355, 348, 362, 335, 340]
    },
    accuracy: {
      peak: '96.4%',
      avg: '84.1%',
      lbl1: 'Flawless Serves',
      lbl2: 'In-bounds Average',
      lineColor: '#00f0ff', // blue
      glowColor: 'rgba(0, 240, 255, 0.3)',
      points: [75, 82, 90, 80, 88, 93, 96, 85, 89]
    }
  };

  let activeSet = dataStreams.spike;

  function renderChart() {
    const w = (canvas.width = canvas.parentElement.clientWidth);
    const h = (canvas.height = canvas.parentElement.clientHeight);

    ctx.clearRect(0, 0, w, h);

    // Draw tech background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridCols = 8;
    const gridRows = 5;

    for (let i = 0; i <= gridCols; i++) {
      const x = (w / gridCols) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let i = 0; i <= gridRows; i++) {
      const y = (h / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Chart Line Spline Drawing
    const points = activeSet.points;
    const paddingX = 40;
    const paddingY = 40;
    const graphWidth = w - paddingX * 2;
    const graphHeight = h - paddingY * 2;

    const maxVal = Math.max(...points) * 1.1;
    const minVal = Math.min(...points) * 0.9;
    const valRange = maxVal - minVal;

    // Calculate coordinate node points on scale
    const coordPoints = points.map((p, idx) => {
      const x = paddingX + (graphWidth / (points.length - 1)) * idx;
      const y = paddingY + graphHeight - ((p - minVal) / valRange) * graphHeight;
      return { x, y };
    });

    // 1. Draw smooth gradient area underneath spline
    const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
    fillGrad.addColorStop(0, activeSet.glowColor);
    fillGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.moveTo(coordPoints[0].x, h - paddingY);
    for (let i = 0; i < coordPoints.length; i++) {
      ctx.lineTo(coordPoints[i].x, coordPoints[i].y);
    }
    ctx.lineTo(coordPoints[coordPoints.length - 1].x, h - paddingY);
    ctx.closePath();
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // 2. Draw actual spline connector curve
    ctx.strokeStyle = activeSet.lineColor;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = activeSet.lineColor;
    ctx.beginPath();

    ctx.moveTo(coordPoints[0].x, coordPoints[0].y);
    for (let i = 0; i < coordPoints.length - 1; i++) {
      const xc = (coordPoints[i].x + coordPoints[i + 1].x) / 2;
      const yc = (coordPoints[i].y + coordPoints[i + 1].y) / 2;
      ctx.quadraticCurveTo(coordPoints[i].x, coordPoints[i].y, xc, yc);
    }
    ctx.lineTo(coordPoints[coordPoints.length - 1].x, coordPoints[coordPoints.length - 1].y);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // 3. Draw coordinates point circles
    coordPoints.forEach((cp, idx) => {
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = activeSet.lineColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Node value tags
      if (idx === coordPoints.length - 3) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Orbitron';
        ctx.fillText(points[idx], cp.x - 10, cp.y - 12);
      }
    });
  }

  // Draw chart updates on selection
  dataSelect.addEventListener('change', () => {
    activeSet = dataStreams[dataSelect.value];
    statPeak.textContent = activeSet.peak;
    statAvg.textContent = activeSet.avg;
    statLbl1.textContent = activeSet.lbl1;
    statLbl2.textContent = activeSet.lbl2;
    renderChart();
  });

  window.addEventListener('resize', renderChart);
  renderChart();
}

/* ==========================================
   5. INTERACTIVE ROSTER REGISTRATION FORM
   ========================================== */
function initRosterRoleSelection() {
  const rosterForm = document.getElementById('roster-form');
  const rosterEmailInput = document.getElementById('roster-email-input');
  const rosterFormBody = document.getElementById('roster-form-body');
  const rosterSuccessPane = document.getElementById('roster-success-pane');
  const successResetBtn = document.getElementById('success-reset-btn');

  if (!rosterForm) return;

  // Action submission check
  rosterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = rosterEmailInput.value.trim();
    if (!email) return;

    // Visual transitions
    rosterFormBody.style.display = 'none';
    rosterSuccessPane.style.display = 'block';
  });

  // Success Reset logic
  successResetBtn.addEventListener('click', () => {
    rosterForm.reset();
    rosterSuccessPane.style.display = 'none';
    rosterFormBody.style.display = 'block';
  });
}

/* ==========================================
   6. Cybernetic Countdown Timer
   ========================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-minutes');
  const secsEl = document.getElementById('countdown-seconds');

  if (!daysEl) return;

  // Set target date to June 1, 2026 00:00:00 (Local Time)
  const targetDate = new Date('June 1, 2026 00:00:00');

  function updateTicker() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference < 0) {
      clearInterval(timerInterval);
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    // Padding strings
    daysEl.textContent = d < 10 ? '0' + d : d;
    hoursEl.textContent = h < 10 ? '0' + h : h;
    minsEl.textContent = m < 10 ? '0' + m : m;
    secsEl.textContent = s < 10 ? '0' + s : s;
  }

  updateTicker();
  const timerInterval = setInterval(updateTicker, 1000);
}

/* ==========================================
   7. HERO NEWSLETTER SIGN-UP ACT
   ========================================== */
function initNewsletterSubmit() {
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('hero-email-input');
  const submitBtn = document.getElementById('hero-submit-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      if (!email) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Added';
      emailInput.disabled = true;
      emailInput.value = 'Alert registered for ' + email;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Notify Me';
        emailInput.disabled = false;
        emailInput.value = '';
      }, 5000);
    });
  }
}
