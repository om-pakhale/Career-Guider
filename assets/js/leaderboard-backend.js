let allRankings = [];
let currentRegion = 'city';
let loggedInUserCity = 'Nagpur';

// 1. Fetch Top 50 Students from Supabase
async function fetchLeaderboardData() {
  try {
    // A. Get current user's city if available
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('city')
        .eq('id', user.id)
        .single();

      if (profile && profile.city) {
        loggedInUserCity = profile.city;
        const cityTab = document.getElementById('tab-city');
        if (cityTab) cityTab.textContent = `🏛️ My City (${loggedInUserCity})`;
      }
    }

    // B. Fetch ranked students
    const { data: students, error } = await supabase
      .from('student_profiles')
      .select('id, full_name, title, level, xp, city, institution_name, department')
      .order('level', { ascending: false })
      .order('xp', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Database ranking error:", error.message);
      return;
    }

    allRankings = students || [];
    applyFiltersAndRender();

  } catch (err) {
    console.error("Unexpected error loading leaderboard:", err);
  }
}

// 2. Region Filter Handler
function setFilterRegion(region) {
  currentRegion = region;
  const tabCity = document.getElementById('tab-city');
  const tabAll = document.getElementById('tab-all');

  if (region === 'city') {
    tabCity.className = 'px-4 py-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 font-bold text-xs border border-cyan-400/30 transition';
    tabAll.className = 'px-4 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 font-bold text-xs transition';
  } else {
    tabAll.className = 'px-4 py-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 font-bold text-xs border border-cyan-400/30 transition';
    tabCity.className = 'px-4 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 font-bold text-xs transition';
  }

  applyFiltersAndRender();
}

// 3. Filter & Render Controller
function applyFiltersAndRender() {
  const searchTerm = (document.getElementById('search-student-input')?.value || '').toLowerCase().trim();

  let filtered = allRankings;

  // Filter by City
  if (currentRegion === 'city') {
    filtered = filtered.filter(s => (s.city || '').toLowerCase() === loggedInUserCity.toLowerCase());
  }

  // Filter by Search Query
  if (searchTerm) {
    filtered = filtered.filter(s => 
      (s.full_name || '').toLowerCase().includes(searchTerm) ||
      (s.title || '').toLowerCase().includes(searchTerm)
    );
  }

  renderPodium(filtered.slice(0, 3));
  renderTable(filtered.slice(3), filtered.length > 3 ? 4 : 1);
}

// 4. Render Top 3 Podium
function renderPodium(top3) {
  // Rank 1
  if (top3[0]) {
    document.getElementById('rank1-name').textContent = top3[0].full_name;
    document.getElementById('rank1-title').textContent = `${top3[0].title || 'Novice'} • ${top3[0].city || 'Nagpur'}`;
    document.getElementById('rank1-level').textContent = `Lv. ${top3[0].level || 1} • ${top3[0].xp || 0} XP`;
  } else {
    document.getElementById('rank1-name').textContent = "No Record";
    document.getElementById('rank1-title').textContent = "--";
    document.getElementById('rank1-level').textContent = "--";
  }

  // Rank 2
  if (top3[1]) {
    document.getElementById('rank2-name').textContent = top3[1].full_name;
    document.getElementById('rank2-title').textContent = `${top3[1].title || 'Novice'} • ${top3[1].city || 'Nagpur'}`;
    document.getElementById('rank2-level').textContent = `Lv. ${top3[1].level || 1}`;
  } else {
    document.getElementById('rank2-name').textContent = "--";
    document.getElementById('rank2-title').textContent = "--";
    document.getElementById('rank2-level').textContent = "--";
  }

  // Rank 3
  if (top3[2]) {
    document.getElementById('rank3-name').textContent = top3[2].full_name;
    document.getElementById('rank3-title').textContent = `${top3[2].title || 'Novice'} • ${top3[2].city || 'Nagpur'}`;
    document.getElementById('rank3-level').textContent = `Lv. ${top3[2].level || 1}`;
  } else {
    document.getElementById('rank3-name').textContent = "--";
    document.getElementById('rank3-title').textContent = "--";
    document.getElementById('rank3-level').textContent = "--";
  }
}

// 5. Render Table Rows (Rank 4+)
function renderTable(students, startRank) {
  const tbody = document.getElementById('leaderboard-table-body');
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="p-6 text-center text-slate-500">
          No additional ranked students found for this filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = students.map((s, idx) => `
    <tr class="hover:bg-slate-900/50 transition">
      <td class="p-4 font-mono font-bold text-slate-400">#${startRank + idx}</td>
      <td class="p-4">
        <p class="font-bold text-slate-200">${s.full_name}</p>
        <p class="text-[11px] text-cyan-400">${s.title || 'Adventurer'}</p>
      </td>
      <td class="p-4 text-slate-400">
        ${s.institution_name || 'Enrolled'} ${s.department ? `<span class="text-[10px] text-slate-500 block">${s.department}</span>` : ''}
      </td>
      <td class="p-4 text-slate-400">${s.city || 'India'}</td>
      <td class="p-4 text-right font-bold text-purple-300">Lv. ${s.level || 1}</td>
    </tr>
  `).join('');
}

// 6. Setup Search Listener and Initial Load
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-student-input');
  if (searchInput) {
    searchInput.addEventListener('input', applyFiltersAndRender);
  }
  fetchLeaderboardData();
});