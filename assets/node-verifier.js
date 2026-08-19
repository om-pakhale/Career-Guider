
let activeNodeTask = null;
let nodeTaskBank = {};

async function loadTaskQuestions() {
  try {
    const res = await fetch('assets/data/node-tasks.json');
    nodeTaskBank = await res.json();
  } catch (err) {
    console.warn("Could not load node-tasks.json, using fallback bank", err);
  }
}


function launchNodeVerification(node) {
  activeNodeTask = node;
  const taskData = nodeTaskBank[node.id] || nodeTaskBank.default_task;

  document.getElementById('verifier-modal-title').textContent = `Verify Mastery: ${node.title}`;
  document.getElementById('verifier-skill-badge').textContent = `Awards ${taskData.skill_name} Lv.${taskData.level_awarded}`;
  document.getElementById('verifier-xp-badge').textContent = `+${node.xp} XP`;


  const quizForm = document.getElementById('quiz-questions-form');
  quizForm.innerHTML = taskData.questions.map((q, qIdx) => `
    <div class="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
      <p class="text-xs font-semibold text-slate-200">${qIdx + 1}. ${q.q}</p>
      <div class="grid grid-cols-1 gap-2 pt-1">
        ${q.options.map((opt, optIdx) => `
          <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-400/40 cursor-pointer text-xs text-slate-300">
            <input type="radio" name="question_${qIdx}" value="${optIdx}" class="accent-cyan-400" required/>
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

 
  switchVerifierTab('quiz');
  document.getElementById('node-modal').classList.add('hidden');
  document.getElementById('node-verifier-modal').classList.remove('hidden');
}


function switchVerifierTab(tab) {
  const tabQuiz = document.getElementById('tab-verify-quiz');
  const tabCert = document.getElementById('tab-verify-cert');
  const secQuiz = document.getElementById('section-verify-quiz');
  const secCert = document.getElementById('section-verify-cert');

  if (tab === 'quiz') {
    tabQuiz.className = 'flex-1 py-2 rounded-lg bg-cyan-400/10 text-cyan-400 font-bold text-xs border border-cyan-400/30 transition';
    tabCert.className = 'flex-1 py-2 text-slate-400 hover:text-slate-200 font-bold text-xs transition';
    secQuiz.classList.remove('hidden');
    secCert.classList.add('hidden');
  } else {
    tabCert.className = 'flex-1 py-2 rounded-lg bg-cyan-400/10 text-cyan-400 font-bold text-xs border border-cyan-400/30 transition';
    tabQuiz.className = 'flex-1 py-2 text-slate-400 hover:text-slate-200 font-bold text-xs transition';
    secCert.classList.remove('hidden');
    secQuiz.classList.add('hidden');
  }
}


async function submitNodeQuiz(e) {
  e.preventDefault();
  const taskData = nodeTaskBank[activeNodeTask.id] || nodeTaskBank.default_task;
  let correctCount = 0;

  taskData.questions.forEach((q, idx) => {
    const selected = document.querySelector(`input[name="question_${idx}"]:checked`);
    if (selected && parseInt(selected.value) === q.answer) {
      correctCount++;
    }
  });

  const percentage = (correctCount / taskData.questions.length) * 100;

  if (percentage >= 80) {
    await recordNodeCompletion(activeNodeTask, taskData, 'quiz_passed', null);
  } else {
    alert(`Assessment Result: ${Math.round(percentage)}%. You need at least 80% to verify this node. Review the materials and try again!`);
  }
}


async function submitCertificateProof(e) {
  e.preventDefault();
  const fileInput = document.getElementById('cert-file-input');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a certificate file (PDF, PNG, or JPG).');
    return;
  }

  const uploadBtn = document.getElementById('btn-upload-cert');
  uploadBtn.disabled = true;
  uploadBtn.textContent = 'Uploading to Storage...';

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${activeNodeTask.id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('certificates')
      .getPublicUrl(filePath);

    const taskData = nodeTaskBank[activeNodeTask.id] || nodeTaskBank.default_task;
    await recordNodeCompletion(activeNodeTask, taskData, 'certificate_uploaded', publicUrl);

  } catch (err) {
    alert('Upload failed: ' + err.message);
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = 'Submit Certificate for Instant Verification';
  }
}

// 6. Record Completion & Skill Level in Supabase
async function recordNodeCompletion(node, taskData, method, certUrl) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // A. Add to completed nodes
    await supabase.from('student_node_completions').insert([
      { user_id: user.id, node_id: node.id, xp_earned: node.xp }
    ]);

    // B. Add / Update verified skill in student_skills ledger
    await supabase.from('student_skills').insert([
      {
        user_id: user.id,
        skill_name: taskData.skill_name,
        skill_type: 'technical',
        skill_level: taskData.level_awarded,
        verification_method: method,
        certificate_url: certUrl
      }
    ]);

    // C. Increment user XP and level
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('xp, level')
      .eq('id', user.id)
      .single();

    const newXP = (profile?.xp || 0) + node.xp;
    const newLevel = Math.floor(newXP / 500) + 1;

    await supabase
      .from('student_profiles')
      .update({ xp: newXP, level: newLevel })
      .eq('id', user.id);

    alert(`🎉 Success! You completed "${node.title}". Awarded: ${taskData.skill_name} Lv.${taskData.level_awarded} and +${node.xp} XP!`);
    closeVerifierModal();
    window.location.reload();

  } catch (err) {
    console.error("Error finalizing verification:", err);
  }
}

function closeVerifierModal() {
  document.getElementById('node-verifier-modal')?.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', loadTaskQuestions);