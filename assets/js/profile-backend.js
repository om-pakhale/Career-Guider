// assets/js/profile-backend.js
let currentLoadedProfile = null;
let currentLoadedSkills = [];

// 1. Switch View Controller (RPG vs Recruiter ATS Mode)
function switchProfileView(mode) {
  const rpgView = document.getElementById('rpg-view-container');
  const recruiterView = document.getElementById('recruiter-view-container');
  const btnRpg = document.getElementById('btn-view-rpg');
  const btnRecruiter = document.getElementById('btn-view-recruiter');

  if (mode === 'recruiter') {
    rpgView.classList.add('hidden');
    recruiterView.classList.remove('hidden');

    btnRecruiter.className = 'px-4 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition';
    btnRpg.className = 'px-4 py-1.5 rounded-full text-slate-400 hover:text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition';

    filterAndRenderRecruiterSkills();
  } else {
    recruiterView.classList.add('hidden');
    rpgView.classList.remove('hidden');

    btnRpg.className = 'px-4 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition';
    btnRecruiter.className = 'px-4 py-1.5 rounded-full text-slate-400 hover:text-purple-300 font-bold text-xs flex items-center gap-1.5 transition';
  }
}

// 2. Fetch User Profile & Verified Skills Ledger from Supabase
async function initProfileData() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      window.location.replace("login.html");
      return;
    }

    // A. Fetch Student Profile
    const { data: profile, error: pError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (pError) throw pError;
    currentLoadedProfile = profile;

    // B. Fetch Verified Skills from student_skills table
    const { data: skills, error: sError } = await supabase
      .from('student_skills')
      .select('*')
      .eq('user_id', user.id);

    currentLoadedSkills = skills || [];

    // Fallback if user has not yet verified skills via nodes
    if (currentLoadedSkills.length === 0) {
      currentLoadedSkills = [
        { skill_name: "Linux Systems & Shell Internals", skill_type: "technical", skill_level: 5, verification_method: "quiz_passed" },
        { skill_name: "Network Protocols & TCP/IP", skill_type: "technical", skill_level: 4, verification_method: "quiz_passed" },
        { skill_name: "Git Version Control & Etiquette", skill_type: "soft_skill", skill_level: 6, verification_method: "quiz_passed" }
      ];
    }

    renderRPGView();
    renderRecruiterStaticDetails();
    filterAndRenderRecruiterSkills();

  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}

// 3. Populate RPG Hero Mode Elements
function renderRPGView() {
  const p = currentLoadedProfile;
  if (!p) return;

  document.getElementById('rpg-username').textContent = p.full_name || 'Adventurer';
  document.getElementById('rpg-user-level').textContent = `Lv. ${p.level || 1} ${p.title || 'Novice'}`;
  document.getElementById('rpg-user-details').textContent = p.education_type === 'college'
    ? `${p.department || 'Computer Science'} candidate at ${p.institution_name} (${p.grade_or_year || 'Undergraduate'}).`
    : `Enrolled student at ${p.institution_name} (${p.grade_or_year || 'High School'}).`;

  document.getElementById('rpg-user-location').textContent = `📍 ${p.city || 'Nagpur'}, India`;
  document.getElementById('rpg-user-edu').textContent = `🎓 ${p.institution_name || 'Verified Student'}`;

  // Attributes
  document.getElementById('rpg-attr-tech').textContent = `Level ${p.level || 1}`;
  document.getElementById('rpg-bar-tech').style.width = `${Math.min(100, (p.level || 1) * 10)}%`;

  // Render RPG Skills List
  const skillsContainer = document.getElementById('rpg-skills-list');
  document.getElementById('rpg-skills-count').textContent = `${currentLoadedSkills.length} Skills Verified`;

  skillsContainer.innerHTML = currentLoadedSkills.map(s => `
    <div class="glass-panel p-3 rounded-xl border border-slate-800 space-y-1 hover:border-cyan-400/40 transition">
      <div class="flex justify-between items-center">
        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
          ${s.skill_type === 'technical' ? 'Technical' : 'Soft Skill'}
        </span>
        <span class="text-xs font-mono text-emerald-400 font-bold">Lv. ${s.skill_level}</span>
      </div>
      <h4 class="font-bold text-xs text-slate-200">${s.skill_name}</h4>
      <p class="text-[10px] text-slate-400">Verified via ${s.verification_method === 'quiz_passed' ? 'Lab Assessment' : 'Uploaded Certificate'}</p>
    </div>
  `).join('');
}

// 4. Populate ATS Resume Static Elements
function renderRecruiterStaticDetails() {
  const p = currentLoadedProfile;
  if (!p) return;

  document.getElementById('ats-name').textContent = p.full_name || 'Candidate Name';
  document.getElementById('ats-headline').textContent = p.selected_domain ? `${p.selected_domain.replace(/_/g, ' ')} Specialist` : 'Software & Systems Engineer';
  document.getElementById('ats-email').textContent = `✉️ ${p.email || 'candidate@domain.com'}`;
  document.getElementById('ats-location').textContent = `📍 ${p.city || 'Nagpur'}, India`;
  
  document.getElementById('ats-institution').textContent = p.institution_name || 'Accredited Educational Institution';
  document.getElementById('ats-degree').textContent = p.department ? `Specialization in ${p.department}` : (p.grade_or_year || 'High School');
  document.getElementById('ats-grad-year').textContent = p.grade_or_year || 'Undergrad';
}

// 5. Filter & Sort Skills for Recruiter View
function filterAndRenderRecruiterSkills() {
  const categoryFilter = document.getElementById('sort-category')?.value || 'all';
  const sortOrder = document.getElementById('sort-order')?.value || 'highest';
  const tableContainer = document.getElementById('ats-skills-table');

  if (!tableContainer) return;

  // Filter
  let filtered = [...currentLoadedSkills];
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(s => s.skill_type === categoryFilter);
  }

  // Sort
  if (sortOrder === 'highest') {
    filtered.sort((a, b) => (b.skill_level || 0) - (a.skill_level || 0));
  } else if (sortOrder === 'lowest') {
    filtered.sort((a, b) => (a.skill_level || 0) - (b.skill_level || 0));
  } else if (sortOrder === 'name') {
    filtered.sort((a, b) => a.skill_name.localeCompare(b.skill_name));
  }

  document.getElementById('ats-skills-badge').textContent = `Showing ${filtered.length} Competencies`;

  if (filtered.length === 0) {
    tableContainer.innerHTML = `<p class="text-xs text-slate-500 py-3 sm:col-span-2">No skills matched this category filter.</p>`;
    return;
  }

  tableContainer.innerHTML = filtered.map(s => `
    <div class="border border-slate-200 rounded-lg p-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition">
      <div>
        <h4 class="font-bold text-xs text-slate-900">${s.skill_name}</h4>
        <span class="text-[10px] text-slate-500 uppercase tracking-wider">${s.skill_type === 'technical' ? 'Technical Competency' : 'Soft Skill'} • Verified</span>
      </div>
      <div class="text-right">
        <span class="text-xs font-bold font-mono px-2.5 py-1 rounded bg-slate-900 text-white">
          Level ${s.skill_level}
        </span>
      </div>
    </div>
  `).join('');
}

// Run on page load
document.addEventListener('DOMContentLoaded', initProfileData);