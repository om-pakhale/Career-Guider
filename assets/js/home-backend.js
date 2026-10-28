async function syncAuthState() {
  const loginCta = document.getElementById('btn-login-cta');
  const userProfileNav = document.getElementById('nav-user-profile');
  const lockIcon = document.getElementById('portal-lock-icon');

  if (!window.supabase) return;

  const { data: { session } } = await supabase.auth.getSession();

  if (session && session.user) {
    if (loginCta) loginCta.classList.add('hidden');
    if (userProfileNav) {
      userProfileNav.classList.remove('hidden');
      userProfileNav.classList.add('flex');
    }
    if (lockIcon) lockIcon.classList.add('hidden');

    // Fetch user details to render avatar badge
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('full_name, title, level')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      const nameEl = document.getElementById('nav-username');
      const levelEl = document.getElementById('nav-user-level');
      if (nameEl) nameEl.textContent = profile.full_name || 'Student';
      if (levelEl) levelEl.textContent = `Lv.${profile.level || 1} ${profile.title || 'Novice'}`;
    }
  } else {
    if (loginCta) loginCta.classList.remove('hidden');
    if (userProfileNav) {
      userProfileNav.classList.add('hidden');
      userProfileNav.classList.remove('flex');
    }
    if (lockIcon) lockIcon.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  syncAuthState();
  if (window.supabase) {
    supabase.auth.onAuthStateChange(() => syncAuthState());
  }
});