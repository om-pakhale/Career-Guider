let currentMode = 'login';
let currentEdu = 'school';

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>'"/\\;]/g, '').trim();
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function switchAuthTab(mode) {
  currentMode = mode;
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const fieldName = document.getElementById('field-name');
  const fieldEdu = document.getElementById('field-education');
  const submitBtn = document.getElementById('btn-submit');

  if (mode === 'register') {
    tabRegister.className = 'flex-1 py-3 tab-active transition font-bold';
    tabLogin.className = 'flex-1 py-3 text-slate-400 hover:text-slate-200 transition';
    fieldName.classList.remove('hidden');
    fieldEdu.classList.remove('hidden');
    submitBtn.textContent = 'Create Adventurer Account & Choose Path ➔';
  } else {
    tabLogin.className = 'flex-1 py-3 tab-active transition font-bold';
    tabRegister.className = 'flex-1 py-3 text-slate-400 hover:text-slate-200 transition';
    fieldName.classList.add('hidden');
    fieldEdu.classList.add('hidden');
    submitBtn.textContent = 'Unlock My Dashboard';
  }
}

function selectEduType(type) {
  currentEdu = type;
  const btnSchool = document.getElementById('btn-school');
  const btnCollege = document.getElementById('btn-college');
  const schoolFields = document.getElementById('school-subfields');
  const collegeFields = document.getElementById('college-subfields');

  if (type === 'school') {
    btnSchool.className = 'py-2 px-3 rounded-lg border border-cyan-400 bg-cyan-400/10 text-cyan-300 text-xs font-bold transition';
    btnCollege.className = 'py-2 px-3 rounded-lg border border-slate-700 text-slate-400 text-xs font-bold transition';
    schoolFields.classList.remove('hidden');
    collegeFields.classList.add('hidden');
  } else {
    btnCollege.className = 'py-2 px-3 rounded-lg border border-cyan-400 bg-cyan-400/10 text-cyan-300 text-xs font-bold transition';
    btnSchool.className = 'py-2 px-3 rounded-lg border border-slate-700 text-slate-400 text-xs font-bold transition';
    collegeFields.classList.remove('hidden');
    schoolFields.classList.add('hidden');
  }
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const rawEmail = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;
  const submitBtn = document.getElementById('btn-submit');
  const originalBtnText = submitBtn.textContent;

  const email = rawEmail.trim().toLowerCase();
  if (!isValidEmail(email)) {
    alert('Security Warning: Please enter a valid email format.');
    return;
  }

  if (password.length < 8) {
    alert('Security Warning: Password must be at least 8 characters long.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Verifying Credentials...';

  try {
    if (currentMode === 'register') {
      const rawName = document.getElementById('input-name').value;
      const fullName = sanitizeInput(rawName);

      let institutionName = '';
      let gradeOrYear = '';
      let department = null;

      if (currentEdu === 'school') {
        institutionName = sanitizeInput(document.getElementById('input-school-name').value);
        gradeOrYear = sanitizeInput(document.getElementById('input-school-grade').value);
      } else {
        institutionName = sanitizeInput(document.getElementById('input-college-name').value);
        gradeOrYear = sanitizeInput(document.getElementById('input-college-year').value);
        department = sanitizeInput(document.getElementById('input-college-dept').value);
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('student_profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName || 'Adventurer',
              email: email,
              education_type: currentEdu,
              institution_name: institutionName || 'Unspecified',
              grade_or_year: gradeOrYear,
              department: department,
              level: 1,
              xp: 0,
              title: 'Novice Adventurer',
              city: 'Nagpur'
            }
          ]);

        if (profileError) throw profileError;
      }

      alert('Account Created! Proceeding to Archetype Assessment.');
      window.location.href = 'interest-quiz.html';

    } else {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;
      if (!authData.session) throw new Error('Access denied. No active session established.');

      window.location.href = 'roadmap-dashboard.html';
    }

  } catch (err) {
    alert('Authentication Failed: ' + (err.message || 'Invalid email or password.'));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});