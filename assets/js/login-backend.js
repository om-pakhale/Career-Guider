let currentMode = 'login';
let currentEdu = 'school';

// 1. Session Check on Initial Load
async function checkExistingSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      window.location.replace('roadmap-dashboard.html');
    }
  } catch (err) {
    console.warn("Session check error:", err);
  }
}

// 2. Input Sanitization Helpers
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>'"/\\;]/g, '').trim();
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

// 3. Mode Toggle (Login vs Register)
function switchAuthTab(mode) {
  currentMode = mode;
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const fieldName = document.getElementById('field-name');
  const fieldCity = document.getElementById('field-city');
  const fieldEdu = document.getElementById('field-education');
  const submitBtn = document.getElementById('btn-submit');

  if (mode === 'register') {
    tabRegister.className = 'flex-1 py-3 tab-active transition font-bold';
    tabLogin.className = 'flex-1 py-3 text-slate-400 hover:text-slate-200 transition';
    fieldName.classList.remove('hidden');
    fieldCity.classList.remove('hidden');
    fieldEdu.classList.remove('hidden');
    submitBtn.textContent = 'Create Profile & Start Career Quiz ➔';
  } else {
    tabLogin.className = 'flex-1 py-3 tab-active transition font-bold';
    tabRegister.className = 'flex-1 py-3 text-slate-400 hover:text-slate-200 transition';
    fieldName.classList.add('hidden');
    fieldCity.classList.add('hidden');
    fieldEdu.classList.add('hidden');
    submitBtn.textContent = 'Unlock My Dashboard';
  }
}

// 4. Education Subfield Toggle (School vs College)
function selectEduType(type) {
  currentEdu = type;
  const btnSchool = document.getElementById('btn-school');
  const btnCollege = document.getElementById('btn-college');
  const schoolFields = document.getElementById('school-subfields');
  const collegeFields = document.getElementById('college-subfields');

  if (type === 'school') {
    btnSchool.className = 'py-2 px-3 rounded-xl border border-cyan-400 bg-cyan-400/10 text-cyan-300 text-xs font-bold transition';
    btnCollege.className = 'py-2 px-3 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold transition';
    schoolFields.classList.remove('hidden');
    collegeFields.classList.add('hidden');
  } else {
    btnCollege.className = 'py-2 px-3 rounded-xl border border-cyan-400 bg-cyan-400/10 text-cyan-300 text-xs font-bold transition';
    btnSchool.className = 'py-2 px-3 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold transition';
    collegeFields.classList.remove('hidden');
    schoolFields.classList.add('hidden');
  }
}

// 5. Auth Submission Handler
document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const rawEmail = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;
  const submitBtn = document.getElementById('btn-submit');
  const originalBtnText = submitBtn.textContent;

  const email = rawEmail.trim().toLowerCase();

  if (!isValidEmail(email)) {
    alert('Please enter a valid email format.');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Verifying Credentials...';

  try {
    if (currentMode === 'register') {
      const rawName = document.getElementById('input-name').value;
      const fullName = sanitizeInput(rawName);
      const city = sanitizeInput(document.getElementById('input-city').value) || 'Nagpur';

      let institutionName = '';
      let gradeOrYear = '';
      let department = null;

      if (currentEdu === 'school') {
        institutionName = sanitizeInput(document.getElementById('input-school-name').value) || 'High School';
        gradeOrYear = sanitizeInput(document.getElementById('input-school-grade').value);
      } else {
        institutionName = sanitizeInput(document.getElementById('input-college-name').value) || 'College/University';
        gradeOrYear = sanitizeInput(document.getElementById('input-college-year').value);
        department = sanitizeInput(document.getElementById('input-college-dept').value);
      }

      // A. Register User Account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // B. Insert Profile Metadata into student_profiles
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('student_profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName || 'Adventurer',
              email: email,
              education_type: currentEdu,
              institution_name: institutionName,
              grade_or_year: gradeOrYear,
              department: department,
              city: city,
              level: 1,
              xp: 0
            }
          ]);

        if (profileError) throw profileError;
      }

      // New users route to the 5-Step Domain Discovery Quiz
      window.location.href = 'interest-quiz.html';

    } else {
      // Sign In Existing User
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;
      if (!authData.session) throw new Error('No active session could be established.');

      // Existing users route directly to the main roadmap tree
      window.location.href = 'roadmap-dashboard.html';
    }

  } catch (err) {
    alert('Authentication Failed: ' + (err.message || 'Check your credentials and try again.'));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});

// Run session check on page load
document.addEventListener('DOMContentLoaded', checkExistingSession);