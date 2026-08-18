
const quizQuestions = [
  {
    id: 1,
    category: "System Interaction",
    title: "When inspecting a newly deployed web application, what is your immediate instinct?",
    options: [
      { text: "Inspect the URL parameters, headers, and inputs to see if I can manipulate or break access control.", domain: "cyber_pentester" },
      { text: "Analyze how the frontend components communicate with backend REST/GraphQL APIs and render state.", domain: "sw_fullstack" },
      { text: "Examine the underlying data models, predictions, and automated classification pipeline.", domain: "ai_engineer" },
      { text: "Check how the services are containerized with Docker, scaled, and monitored under load.", domain: "sw_devops" }
    ]
  },
  {
    id: 2,
    category: "Core Problem Solving",
    title: "Which type of challenge sounds most engaging to spend an entire weekend solving?",
    options: [
      { text: "Auditing network packet streams in Wireshark to locate unauthorized lateral movement.", domain: "cyber_soc" },
      { text: "Building a responsive multi-user dashboard with real-time WebSocket state synchronizations.", domain: "sw_fullstack" },
      { text: "Optimizing loss functions and hyper-parameters in PyTorch to boost classification accuracy.", domain: "ai_engineer" },
      { text: "Writing low-level firmware in C to read sensor data over UART/I2C buses on a microcontroller.", domain: "core_embedded" }
    ]
  },
  {
    id: 3,
    category: "Architectural Preference",
    title: "If you had to design the critical backbone of an enterprise platform, which role would you take?",
    options: [
      { text: "Designing Zero-Trust authorization policies, cryptography keys, and pen-testing every endpoint.", domain: "cyber_pentester" },
      { text: "Constructing scalable database schemas with PostgreSQL, caching tiers, and API microservices.", domain: "sw_fullstack" },
      { text: "Creating self-healing Kubernetes clusters with automated GitHub Actions CI/CD pipelines.", domain: "sw_devops" },
      { text: "Training large language models with RAG (Retrieval-Augmented Generation) and vector search.", domain: "ai_engineer" }
    ]
  },
  {
    id: 4,
    category: "Tooling & Tech Stack",
    title: "Which toolset feels most natural or appealing for your daily workflow?",
    options: [
      { text: "Linux Terminal, Burp Suite, Metasploit, Nmap, and Bash automation scripts.", domain: "cyber_pentester" },
      { text: "VS Code, Node.js, React/Tailwind, PostgreSQL, and Git version control.", domain: "sw_fullstack" },
      { text: "Jupyter Notebooks, Python, Pandas, PyTorch, and Hugging Face embeddings.", domain: "ai_engineer" },
      { text: "FreeRTOS, KiCad, Logic Analyzers, Oscilloscopes, and Embedded C.", domain: "core_embedded" }
    ]
  },
  {
    id: 5,
    category: "Final Mission Objective",
    title: "What is your ultimate capstone engineering vision?",
    options: [
      { text: "Leading simulated enterprise red-team breaches and securing critical cyber infrastructure.", domain: "cyber_pentester" },
      { text: "Shipping a scalable multi-tenant SaaS application used by thousands of daily active users.", domain: "sw_fullstack" },
      { text: "Building autonomous multimodal AI agents that understand context and solve complex queries.", domain: "ai_engineer" },
      { text: "Architecting high-availability global cloud systems that achieve 99.999% uptime reliability.", domain: "sw_devops" }
    ]
  }
];

// Domain Metadata Dictionary for Results
const domainMeta = {
  cyber_pentester: {
    title: "Cybersecurity & Ethical Hacker (Offensive Track)",
    desc: "Specialize in vulnerability discovery, web app exploitation, network penetration testing, and access control triage.",
    badge: "Cyber Shinobi",
    icon: "security"
  },
  cyber_soc: {
    title: "SOC Analyst & Defensive Responder (Blue Team)",
    desc: "Specialize in SIEM rule correlation, threat hunting, digital memory forensics, and rapid incident containment.",
    badge: "Cyber Sentinel",
    icon: "shield"
  },
  sw_fullstack: {
    title: "Full-Stack Software Alchemist",
    desc: "Master modern reactive frontends, resilient backend APIs, PostgreSQL relational schemas, and cloud deployment.",
    badge: "Code Alchemist",
    icon: "code"
  },
  sw_devops: {
    title: "DevOps & Cloud Systems Architect",
    desc: "Master automated CI/CD pipelines, Kubernetes container orchestration, Terraform IaC, and observability.",
    badge: "Cloud Commander",
    icon: "cloud"
  },
  ai_engineer: {
    title: "AI & Machine Learning Data Wizard",
    desc: "Train deep neural networks, build RAG pipelines with LLMs, and deploy production inference microservices.",
    badge: "Data Wizard",
    icon: "smart_toy"
  },
  core_embedded: {
    title: "Embedded Systems & IoT Hardware Engineer",
    desc: "Design custom PCB schematics, write FreeRTOS firmware, and interface hardware sensors with low-level C.",
    badge: "Hardware Artisan",
    icon: "memory"
  }
};

// State Variables
let currentStepIndex = 0;
let domainScores = {
  cyber_pentester: 0,
  cyber_soc: 0,
  sw_fullstack: 0,
  sw_devops: 0,
  ai_engineer: 0,
  core_embedded: 0
};
let selectedOptionDomain = null;
let finalizedChosenDomain = 'cyber_pentester';

// 2. Render Current Question
function renderQuestion() {
  const q = quizQuestions[currentStepIndex];
  if (!q) return;

  selectedOptionDomain = null;
  document.getElementById('current-step').textContent = currentStepIndex + 1;
  document.getElementById('progress-bar').style.width = `${((currentStepIndex + 1) / 5) * 100}%`;
  document.getElementById('question-category').textContent = q.category;
  document.getElementById('question-title').textContent = q.title;

  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = true;

  const container = document.getElementById('options-container');
  container.innerHTML = q.options.map((opt, idx) => `
    <div onclick="selectQuizOption(${idx}, '${opt.domain}')" id="opt-card-${idx}" class="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-400/50 cursor-pointer transition flex items-start gap-3">
      <div class="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs text-cyan-400 shrink-0 mt-0.5">
        ${String.fromCharCode(65 + idx)}
      </div>
      <p class="text-xs sm:text-sm text-slate-300">${opt.text}</p>
    </div>
  `).join('');
}

// 3. Select Option Handler
function selectQuizOption(index, domain) {
  selectedOptionDomain = domain;

  // Visual selection toggle
  document.querySelectorAll('#options-container > div').forEach(card => card.classList.remove('option-selected'));
  document.getElementById(`opt-card-${index}`)?.classList.add('option-selected');

  document.getElementById('next-btn').disabled = false;
}

// 4. Step Navigation
function handleNextStep() {
  if (!selectedOptionDomain) return;

  // Add score
  domainScores[selectedOptionDomain] += 20;

  if (currentStepIndex < 4) {
    currentStepIndex++;
    renderQuestion();
  } else {
    showResults();
  }
}

// 5. Calculate and Display Top 3 Recommendations
function showResults() {
  document.getElementById('quiz-canvas').classList.add('hidden');
  document.getElementById('result-view').classList.remove('hidden');

  // Sort domains by highest score
  const sortedDomains = Object.keys(domainScores).sort((a, b) => domainScores[b] - domainScores[a]);
  const top3 = sortedDomains.slice(0, 3);
  finalizedChosenDomain = top3[0]; // Default to #1 match

  const recContainer = document.getElementById('recommended-domains-grid');
  recContainer.innerHTML = top3.map((domainKey, idx) => {
    const meta = domainMeta[domainKey];
    const isTop = idx === 0;
    return `
      <div onclick="selectRecommendedDomain('${domainKey}')" id="rec-card-${domainKey}" class="glass-panel p-4 rounded-xl border ${isTop ? 'border-cyan-400 bg-cyan-400/10 neon-cyan' : 'border-slate-800'} cursor-pointer transition space-y-1">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm text-cyan-400">${meta.icon}</span>
            <span class="text-xs font-bold text-slate-100">${meta.title}</span>
          </div>
          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isTop ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-400'} uppercase">
            ${isTop ? '★ 95% Match' : `${85 - idx * 10}% Match`}
          </span>
        </div>
        <p class="text-[11px] text-slate-400">${meta.desc}</p>
      </div>
    `;
  }).join('');
}

// 6. Handle Domain Selection from Top 3
function selectRecommendedDomain(domainKey) {
  finalizedChosenDomain = domainKey;

  document.querySelectorAll('#recommended-domains-grid > div').forEach(c => {
    c.className = 'glass-panel p-4 rounded-xl border border-slate-800 cursor-pointer transition space-y-1';
  });

  const activeCard = document.getElementById(`rec-card-${domainKey}`);
  if (activeCard) {
    activeCard.className = 'glass-panel p-4 rounded-xl border border-cyan-400 bg-cyan-400/10 neon-cyan cursor-pointer transition space-y-1';
  }

  // Reset override select box
  const overrideSelect = document.getElementById('domain-override-select');
  if (overrideSelect) overrideSelect.value = '';
}

// 7. Handle Manual Override Dropdown
function handleDomainOverride(domainKey) {
  if (!domainKey) return;
  finalizedChosenDomain = domainKey;

  // Deselect top 3 cards
  document.querySelectorAll('#recommended-domains-grid > div').forEach(c => {
    c.className = 'glass-panel p-4 rounded-xl border border-slate-800 cursor-pointer transition space-y-1';
  });
}

// 8. Commit Domain to Supabase & Enter Dashboard
async function saveTrackAndProceed() {
  const claimBtn = document.getElementById('claim-btn');
  const originalText = claimBtn.innerHTML;

  claimBtn.disabled = true;
  claimBtn.innerHTML = `
    <span class="material-symbols-outlined text-sm animate-spin">sync</span>
    <span>Generating Multi-Branch Skill Tree...</span>
  `;

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Session expired. Please sign in again.");
      window.location.replace('login.html');
      return;
    }

    const meta = domainMeta[finalizedChosenDomain] || domainMeta.cyber_pentester;

    // Update student's profile with selected domain
    const { error: dbError } = await supabase
      .from('student_profiles')
      .update({
        selected_domain: finalizedChosenDomain,
        title: meta.badge,
        level: 1,
        xp: 150 // Welcome assessment bonus
      })
      .eq('id', user.id);

    if (dbError) throw dbError;

    // Route straight to personalized skill tree
    window.location.href = 'roadmap-dashboard.html';

  } catch (err) {
    alert("Failed to initialize roadmap: " + err.message);
    claimBtn.disabled = false;
    claimBtn.innerHTML = originalText;
  }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', renderQuestion);