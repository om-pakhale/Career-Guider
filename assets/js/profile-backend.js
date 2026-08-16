let isCorpMode = false;

// 1. Toggle between RPG Mode and Recruiter Resume Mode
function setupModeToggle() {
  const toggleBtn = document.getElementById('mode-toggle-btn');
  const body = document.getElementById('profile-body');
  const dot = document.getElementById('toggle-dot');
  const labelRpg = document.getElementById('label-rpg');
  const labelRecruiter = document.getElementById('label-recruiter');

  toggleBtn.addEventListener('click', () => {
    isCorpMode = !isCorpMode;

    if (isCorpMode) {
      body.classList.add('corp-mode');
      dot.classList.add('translate-x-5');
      labelRecruiter.className = 'text-xs font-bold text-purple-600 pr-2';
      labelRpg.className = 'text-xs font-bold text-slate-400 pl-2';
    } else {
      body.classList.remove('corp-mode');
      dot.classList.remove('translate-x-5');
      labelRpg.className = 'text-xs font-bold text-cyan-400 pl-2';
      labelRecruiter.className = 'text-xs font-bold text-slate-500 pr-2';
    }
  });

  // Print PDF Trigger
  document.getElementById('export-pdf-btn').addEventListener('click', () => {
    window.print();
  });
}

// 2. Fetch Verified Profile Details from Supabase
async function loadMyProfile() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Session expired or invalid. Please log in.");
      window.location.replace("login.html");
      return;
    }

    const { data: profile, error: dbError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError) {
      console.error("Profile load error:", dbError.message);
      return;
    }

    // Populate Dynamic DOM Elements
    const usernameEl = document.getElementById('username');
    const userLevelEl = document.getElementById('user-level');
    const userDetailsEl = document.getElementById('user-details');
    const userLocationEl = document.getElementById('user-location');
    const userEduBadge = document.getElementById('user-edu-badge');

    if (usernameEl) usernameEl.textContent = profile.full_name || "Adventurer";
    if (userLevelEl) userLevelEl.textContent = `Lv. ${profile.level || 1} ${profile.title || 'Novice'}`;
    
    if (userDetailsEl) {
      userDetailsEl.textContent = profile.education_type === 'college'
        ? `${profile.department || 'Engineering'} student at ${profile.institution_name} (${profile.grade_or_year || 'Undergrad'}).`
        : `Student at ${profile.institution_name} (${profile.grade_or_year || 'High School'}).`;
    }

    if (userLocationEl) userLocationEl.textContent = `📍 ${profile.city || 'Nagpur'}, India`;
    if (userEduBadge) userEduBadge.textContent = `🎓 ${profile.institution_name || 'Enrolled Student'}`;

  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

// Initialize when page elements are ready
document.addEventListener('DOMContentLoaded', () => {
  setupModeToggle();
  loadMyProfile();
});