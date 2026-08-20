// assets/js/home-backend.js
let offlineColleges = [];

// 1. Session Detection & Immediate UI Update
async function syncAuthState() {
  const loginCta = document.getElementById('btn-login-cta');
  const userProfileNav = document.getElementById('nav-user-profile');
  const portalBtn = document.getElementById('mode-portal-btn');
  const lockIcon = document.getElementById('portal-lock-icon');

  if (!window.supabase) {
    console.error("Supabase client is not loaded.");
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (session && session.user) {
    // Authenticated state: Hide Sign In button and reveal user profile card
    if (loginCta) loginCta.classList.add('hidden');
    if (userProfileNav) {
      userProfileNav.classList.remove('hidden');
      userProfileNav.classList.add('flex');
    }
    if (lockIcon) lockIcon.classList.add('hidden');
    if (portalBtn) portalBtn.href = 'roadmap-dashboard.html';

    // Fetch user profile info
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('full_name, title, level')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      const nameEl = document.getElementById('nav-username');
      const levelEl = document.getElementById('nav-user-level');
      if (nameEl) nameEl.textContent = profile.full_name || 'Student';
      if (levelEl) levelEl.textContent = `Lv.${profile.level || 1} ${profile.title || ''}`;
    }
  } else {
    // Unauthenticated state
    if (loginCta) loginCta.classList.remove('hidden');
    if (userProfileNav) {
      userProfileNav.classList.add('hidden');
      userProfileNav.classList.remove('flex');
    }
    if (lockIcon) lockIcon.classList.remove('hidden');
    if (portalBtn) portalBtn.href = 'login.html';
  }
}

// 2. Load Offline JSON Database
async function initOfflineDatabase() {
  try {
    const response = await fetch('assets/data/colleges-offline.json');
    offlineColleges = await response.json();
  } catch (err) {
    offlineColleges = [
      { id: 1, name: "COEP Technological University", city: "Pune", exam: "MHT-CET / JEE Main", category: "General", cutoff_score: 99.2, branches: ["Computer Engg", "AI"], type: "Govt Autonomous" },
      { id: 2, name: "VJTI Mumbai", city: "Mumbai", exam: "MHT-CET / JEE Main", category: "General", cutoff_score: 99.0, branches: ["CSE", "Cybersecurity"], type: "Govt Autonomous" },
      { id: 3, name: "Government Medical College (GMC)", city: "Nagpur", exam: "NEET", category: "General", cutoff_score: 645, branches: ["MBBS"], type: "Govt Medical" },
      { id: 4, name: "DKTE Society's Institute", city: "Ichalkaranji", exam: "MHT-CET / JEE Main", category: "General", cutoff_score: 88.5, branches: ["AI/ML", "CSE"], type: "Autonomous" }
    ];
  }
}

// 3. Search Form Handler
function setupSearchHandler() {
  const form = document.getElementById('college-filter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedExam = document.getElementById('filter-exam').value;
    const userScore = parseFloat(document.getElementById('filter-score').value) || 0;
    const selectedCategory = document.getElementById('filter-category').value;
    const cityQuery = document.getElementById('filter-city').value.toLowerCase().trim();

    const results = offlineColleges.filter(col => {
      const matchExam = (selectedExam === 'all') || col.exam.toLowerCase().includes(selectedExam.toLowerCase());
      const matchCategory = (selectedCategory === 'all') || (col.category === selectedCategory);
      const matchCity = !cityQuery || col.city.toLowerCase().includes(cityQuery);
      const matchScore = userScore === 0 || (userScore >= (col.cutoff_score * 0.9));

      return matchExam && matchCategory && matchCity && matchScore;
    });

    renderResults(results);
  });
}

function renderResults(results) {
  const wrapper = document.getElementById('results-wrapper');
  const grid = document.getElementById('results-grid');
  const countEl = document.getElementById('results-count');

  if (!wrapper || !grid) return;

  wrapper.classList.remove('hidden');
  countEl.textContent = `${results.length} colleges found`;

  if (results.length === 0) {
    grid.innerHTML = `
      <div class="sm:col-span-2 p-6 glass-panel rounded-xl text-center text-slate-400 text-xs">
        No colleges matched your exact criteria. Try broadening your score or city query.
      </div>
    `;
    return;
  }

  grid.innerHTML = results.map(col => `
    <div class="glass-panel p-4 rounded-xl border border-slate-800 space-y-2 hover:border-cyan-400/50 transition">
      <div class="flex justify-between items-start">
        <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">${col.type}</span>
        <span class="text-xs text-amber-400 font-mono font-bold">Cutoff: ${col.cutoff_score}</span>
      </div>
      <h4 class="font-bold text-sm text-slate-100">${col.name}</h4>
      <p class="text-xs text-slate-400">📍 ${col.city} • <span class="text-purple-300">${col.exam}</span></p>
      <div class="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
        Branches: <span class="text-slate-200">${col.branches.join(', ')}</span>
      </div>
    </div>
  `).join('');
}

// Listen to real-time auth changes
document.addEventListener('DOMContentLoaded', () => {
  syncAuthState();
  initOfflineDatabase();
  setupSearchHandler();

  if (window.supabase) {
    supabase.auth.onAuthStateChange(() => {
      syncAuthState();
    });
  }
});