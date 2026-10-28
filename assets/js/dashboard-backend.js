document.getElementById('header-username').textContent = profile.full_name || 'Adventurer';
document.getElementById('header-title').textContent = profile.title || 'Novice';
document.getElementById('header-user-level').textContent = `Lv.${profile.level || 1}`;
document.getElementById('header-city-rank').textContent = `${profile.city || 'Nagpur'} Rank`;
javascript
// assets/js/dashboard-backend.js

const softSkillTasks = [
  { id: 'soft-git', title: 'Open-Source & Git Etiquette', domain: 'Collaboration', xp: 150, status: 'active', desc: 'Write semantic commit messages, structure pull requests, and resolve merge conflicts.' },
  { id: 'soft-docs', title: 'Technical Architecture Writing', domain: 'Documentation', xp: 200, status: 'locked', desc: 'Draft clean READMEs, API endpoint specs, and security threat disclosures.' },
  { id: 'soft-interview', title: 'System Design Mock Defense', domain: 'Communication', xp: 300, status: 'locked', desc: 'Explain trade-offs between SQL vs NoSQL schemas and defensive mitigation.' }
];

async function loadDashboard() {
  try {
    if (!window.supabase) {
      console.error("Supabase client is not loaded.");
      return;
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      window.location.replace("login.html");
      return;
    }

    const { data: profile, error: dbError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError || !profile) {
      console.warn("Profile not found:", dbError?.message);
    }

    const p = profile || {};

    // --- Null-Safe Header Updates ---
    const usernameEl = document.getElementById('header-username');
    if (usernameEl) usernameEl.textContent = p.full_name || 'Adventurer';

    const titleEl = document.getElementById('header-title');
    if (titleEl) titleEl.textContent = p.title || 'Novice';

    const userLevelEl = document.getElementById('header-user-level');
    if (userLevelEl) userLevelEl.textContent = `Lv.${p.level || 1}`;

    const cityRankEl = document.getElementById('header-city-rank');
    if (cityRankEl) cityRankEl.textContent = `${p.city || 'Nagpur'} Rank`;

    const xpBar = document.getElementById('header-xp-bar');
    if (xpBar) {
      const currentXp = p.xp || 0;
      const progressPercent = (currentXp % 500) / 5;
      xpBar.style.width = `${Math.min(100, Math.max(10, progressPercent))}%`;
    }

    // --- Completions Fetch ---
    const { data: completions } = await supabase
      .from('student_node_completions')
      .select('node_id')
      .eq('user_id', user.id);

    const completedNodeIds = new Set((completions || []).map(c => c.node_id));

    // --- Render Dynamic Skill Tree Flowchart ---
    if (window.RoadmapRegistry && typeof window.RoadmapRegistry.resolveTrack === 'function') {
      const trackKey = window.RoadmapRegistry.resolveTrack(p.selected_domain || p.department || 'cyber_pentester');
      if (typeof renderDynamicSkillTree === 'function') {
        renderDynamicSkillTree(trackKey, completedNodeIds);
      }
    } else if (typeof renderDynamicSkillTree === 'function') {
      renderDynamicSkillTree('cyber_pentester', completedNodeIds);
    }

    renderSoftSkills();

  } catch (err) {
    console.error("Dashboard initialization error:", err);
  }
}

function renderSoftSkills() {
  const container = document.getElementById('soft-skills-container');
  if (!container) return;

  container.innerHTML = softSkillTasks.map(task => `
    <div class="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-2 hover:border-purple-500/40 transition">
      <div class="flex justify-between items-center">
        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 uppercase">
          ${task.domain}
        </span>
        <span class="text-xs font-mono text-cyan-400 font-bold">+${task.xp} XP</span>
      </div>
      <h4 class="font-bold text-xs text-slate-200">${task.title}</h4>
      <p class="text-[11px] text-slate-400">${task.desc}</p>
      <button onclick="alert('Soft-Skill Interactive Module launching...')" class="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-lg text-[11px] transition">
        Launch Task
      </button>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadDashboard);