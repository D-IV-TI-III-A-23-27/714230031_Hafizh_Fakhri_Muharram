/* ============================================================
   LSTM Visualization – script.js
   Interactive gate controls & scroll animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Data for each gate ───────────────────────────────────
  const gateData = {
    forget: {
      title: 'Forget Gate',
      color: 'pink',
      description:
        'Forget Gate menentukan informasi mana dari cell state sebelumnya yang harus <strong>dibuang</strong>. Ia menerima input berupa hidden state sebelumnya (h<sub>t-1</sub>) dan input saat ini (x<sub>t</sub>), lalu menghasilkan nilai antara 0 (buang semua) dan 1 (simpan semua) melalui fungsi sigmoid.',
      formula: '$$f_t = \\sigma(W_f \\cdot [h_{t-1},\\, x_t] + b_f)$$',
    },
    input: {
      title: 'Input Gate',
      color: 'green',
      description:
        'Input Gate menentukan informasi baru apa yang akan <strong>disimpan</strong> ke dalam cell state. Terdiri dari dua bagian: fungsi sigmoid yang memilih nilai mana yang akan di-update, dan fungsi tanh yang membuat vektor kandidat nilai baru.',
      formula:
        '$$i_t = \\sigma(W_i \\cdot [h_{t-1},\\, x_t] + b_i)$$$$\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1},\\, x_t] + b_C)$$',
    },
    output: {
      title: 'Output Gate',
      color: 'purple',
      description:
        'Output Gate menentukan apa yang menjadi <strong>output</strong> (hidden state) dari sel LSTM. Output didasarkan pada cell state yang sudah difilter. Sigmoid memutuskan bagian mana dari cell state yang akan di-output, kemudian dikalikan dengan tanh dari cell state.',
      formula:
        '$$o_t = \\sigma(W_o \\cdot [h_{t-1},\\, x_t] + b_o)$$$$h_t = o_t \\ast \\tanh(C_t)$$',
    },
  };

  // ─── DOM references ───────────────────────────────────────
  const gateButtons = document.querySelectorAll('.gate-btn');
  const gateBlocks = document.querySelectorAll('.gate-block');
  const infoTerminal = document.getElementById('info-terminal');
  const terminalBody = document.getElementById('terminal-body');

  // ─── Gate click handler ───────────────────────────────────
  function activateGate(gateName) {
    // Remove all active states
    gateButtons.forEach((btn) => btn.classList.remove('active'));
    gateBlocks.forEach((block) => block.classList.remove('active'));

    // Remove glow classes from terminal
    infoTerminal.classList.remove('glow-pink', 'glow-green', 'glow-purple');

    // Set active on the corresponding button and block
    const activeBtn = document.querySelector(`.gate-btn[data-gate="${gateName}"]`);
    const activeBlock = document.querySelector(`.gate-block[data-gate="${gateName}"]`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activeBlock) activeBlock.classList.add('active');

    // Apply terminal glow
    const data = gateData[gateName];
    if (data) {
      infoTerminal.classList.add(`glow-${data.color}`);

      // Populate terminal
      terminalBody.innerHTML = `
        <p class="prompt">$ explain --gate="${data.title}"</p>
        <h4>${data.title}</h4>
        <p>${data.description}</p>
        <div class="formula">${data.formula}</div>
      `;

      // Re-render MathJax if available
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([terminalBody]).catch((err) =>
          console.warn('MathJax typeset error:', err)
        );
      }
    }
  }

  // ─── Attach click events to buttons ───────────────────────
  gateButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const gate = btn.getAttribute('data-gate');
      activateGate(gate);
    });
  });

  // ─── Attach click events to diagram gate blocks ───────────
  gateBlocks.forEach((block) => {
    block.addEventListener('click', () => {
      const gate = block.getAttribute('data-gate');
      activateGate(gate);
    });
  });

  // ─── Scroll-reveal animation using IntersectionObserver ───
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections that should animate
  document.querySelectorAll('.card, .proscons-card, .diagram-wrapper, .controls-panel').forEach((el) => {
    observer.observe(el);
  });

  // ─── Activate Forget Gate by default after a brief delay ──
  setTimeout(() => {
    activateGate('forget');
  }, 600);
});
