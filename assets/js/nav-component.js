// assets/js/nav-component.js

async function syncGlobalNavbar() {
  try {
    if (!window.supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    const guestCta = document.getElementById('btn-login-cta');
    const profileHub = document.getElementById('nav-user-profile');
    const usernameEl = document.getElementById('header-username') || document.getElementById('nav-username');
    const userTitleEl = document.getElementById('header-title') || document.getElementById('nav-user-level');
    const userLevelBox = document.getElementById('header-user-level');

    if (session && session.user) {
      if (guestCta) guestCta.classList.add('hidden');
      if (profileHub) {
        profileHub.classList.remove('hidden');
        profileHub.classList.add('flex');
        profileHub.setAttribute('href', 'profile.html');
      }

      // Fetch user profile metadata
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('full_name, title, level, xp')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        if (usernameEl) usernameEl.textContent = profile.full_name || 'Adventurer';
        if (userTitleEl) userTitleEl.textContent = `Lv.${profile.level || 1} • ${profile.title || 'Novice'}`;
        if (userLevelBox) userLevelBox.textContent = `Lv.${profile.level || 1}`;

        // XP bar progress if available
        const xpBar = document.getElementById('header-xp-bar');
        if (xpBar) {
          const percent = ((profile.xp || 0) % 500) / 5;
          xpBar.style.width = `${Math.min(100, Math.max(12, percent))}%`;
        }
      }
    } else {
      if (guestCta) guestCta.classList.remove('hidden');
      if (profileHub) profileHub.classList.add('hidden');
    }
  } catch (err) {
    console.warn("Navbar sync warning:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  syncGlobalNavbar();
  if (window.supabase) {
    supabase.auth.onAuthStateChange(() => syncGlobalNavbar());
  }
});