
let currentLoadedRoadmap = null;

function renderDynamicSkillTree(trackKey, completedNodeIds = new Set()) {
  const roadmap = window.RoadmapRegistry[trackKey] || window.RoadmapRegistry.cyber_pentester;
  currentLoadedRoadmap = roadmap;
  const container = document.getElementById('skill-tree-container');
  if (!container) return;

  document.getElementById('roadmap-title').textContent = roadmap.title;
  document.getElementById('roadmap-desc').textContent = roadmap.description;

  container.innerHTML = '';

  roadmap.layers.forEach((layer, layerIdx) => {
    const layerDiv = document.createElement('div');
    layerDiv.className = 'flex flex-col md:flex-row justify-around items-center w-full gap-4 sm:gap-6 my-4 sm:my-6 relative z-10';

    layer.forEach((node) => {
      const isCompleted = completedNodeIds.has(node.id) || node.status === 'completed';
      const nodeCard = document.createElement('div');
      nodeCard.id = node.id;

      let borderGlow = 'border-slate-800 bg-slate-950/60 opacity-60';
      let badgeColor = 'bg-slate-800 text-slate-400';
      let icon = 'lock';
      let statusLabel = 'Locked';

      if (isCompleted) {
        borderGlow = 'border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer';
        badgeColor = 'bg-emerald-950 text-emerald-400 border border-emerald-800';
        icon = 'check_circle';
        statusLabel = 'Mastered';
      } else if (node.status === 'active' || layerIdx === 0 || layerIdx === 1) {
        borderGlow = 'border-cyan-400 bg-slate-900 border-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-pulse cursor-pointer';
        badgeColor = 'bg-cyan-950 text-cyan-300 border border-cyan-800';
        icon = 'play_arrow';
        statusLabel = 'Ready for Verification';
      }

      nodeCard.className = `p-4 rounded-xl border ${borderGlow} transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 w-full md:w-64 text-left flex flex-col justify-between`;
      nodeCard.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor} uppercase tracking-wider">${node.domain}</span>
          <span class="material-symbols-outlined text-sm ${isCompleted ? 'text-emerald-400' : (statusLabel.includes('Ready') ? 'text-cyan-400' : 'text-slate-500')}">${icon}</span>
        </div>
        <h4 class="font-bold text-slate-200 text-sm mb-1">${node.title}</h4>
        <p class="text-[11px] text-slate-400 line-clamp-2">${node.summary}</p>
        <div class="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
          <span class="font-mono text-cyan-400 font-bold">+${node.xp} XP</span>
          <span class="text-[10px] text-slate-400 uppercase font-semibold">${statusLabel}</span>
        </div>
      `;

      nodeCard.addEventListener('click', () => {
        openNodeModal({ ...node, isCompleted });
      });

      layerDiv.appendChild(nodeCard);
    });

    container.appendChild(layerDiv);
  });
}


function openNodeModal(node) {
  const modal = document.getElementById('node-modal');
  if (!modal) return;

  document.getElementById('modal-node-title').textContent = node.title;
  document.getElementById('modal-node-domain').textContent = node.domain;
  document.getElementById('modal-node-summary').textContent = node.summary;
  document.getElementById('modal-node-xp').textContent = `+${node.xp} XP`;

  const actionBtn = document.getElementById('modal-action-btn');
  if (node.isCompleted) {
    actionBtn.textContent = '✓ Node Already Verified (View Details)';
    actionBtn.disabled = false;
    actionBtn.className = 'w-full py-2.5 bg-slate-800 text-emerald-400 font-bold rounded-xl text-xs transition';
    actionBtn.onclick = () => alert('This node has been completed and verified on your permanent ledger.');
  } else {
    actionBtn.textContent = 'Verify Mastery (Solve Quiz / Upload Certificate) ➔';
    actionBtn.disabled = false;
    actionBtn.className = 'w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition hover:opacity-90 neon-cyan';
    actionBtn.onclick = () => launchNodeVerification(node);
  }

  modal.classList.remove('hidden');
}

function closeNodeModal() {
  document.getElementById('node-modal')?.classList.add('hidden');
}