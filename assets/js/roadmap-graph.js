// assets/js/roadmap-graph.js
let currentLoadedRoadmap = null;

function renderDynamicSkillTree(trackKey, completedNodeIds = new Set()) {
  const roadmap = window.RoadmapRegistry[trackKey] || window.RoadmapRegistry.cyber_pentester;
  currentLoadedRoadmap = roadmap;
  const container = document.getElementById('skill-tree-container');
  if (!container) return;

  document.getElementById('roadmap-title').textContent = roadmap.title;
  document.getElementById('roadmap-desc').textContent = roadmap.description;

  container.innerHTML = '';

  // 1. Create Wrapper with SVG Canvas Layer
  const treeWrapper = document.createElement('div');
  treeWrapper.id = 'tree-canvas-wrapper';
  treeWrapper.className = 'relative w-full flex flex-col items-center gap-16 py-6';

  // SVG Layer for dynamic connector lines
  const svgCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgCanvas.id = 'tree-svg-canvas';
  svgCanvas.className = 'absolute inset-0 w-full h-full pointer-events-none z-0';
  treeWrapper.appendChild(svgCanvas);

  // 2. Render Graph Layers
  roadmap.layers.forEach((layer, layerIdx) => {
    const layerDiv = document.createElement('div');
    layerDiv.className = 'flex flex-row justify-around items-center w-full gap-8 relative z-10';

    layer.forEach((node) => {
      const isCompleted = completedNodeIds.has(node.id) || node.status === 'completed';
      const nodeCard = document.createElement('div');
      nodeCard.id = `node-${node.id}`;
      
      let borderGlow = 'border-slate-800 bg-slate-950/80 opacity-60';
      let badgeColor = 'bg-slate-800 text-slate-400';
      let icon = 'lock';
      let statusLabel = 'Locked';

      if (isCompleted) {
        borderGlow = 'border-emerald-500/60 bg-slate-900/90 shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer';
        badgeColor = 'bg-emerald-950 text-emerald-400 border border-emerald-800';
        icon = 'check_circle';
        statusLabel = 'Mastered';
      } else if (node.status === 'active' || layerIdx === 0 || layerIdx === 1) {
        borderGlow = 'border-cyan-400 bg-slate-900/95 border-2 shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-pulse cursor-pointer';
        badgeColor = 'bg-cyan-950 text-cyan-300 border border-cyan-800';
        icon = 'play_arrow';
        statusLabel = 'Ready to Verify';
      }

      nodeCard.className = `p-4 rounded-2xl border ${borderGlow} transition-all duration-300 hover:scale-105 w-60 text-left flex flex-col justify-between shrink-0 min-h-[140px] relative`;
      nodeCard.innerHTML = `
        <div>
          <div class="flex justify-between items-start mb-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor} uppercase tracking-wider">${node.domain}</span>
            <span class="material-symbols-outlined text-sm ${isCompleted ? 'text-emerald-400' : (statusLabel.includes('Ready') ? 'text-cyan-400' : 'text-slate-500')}">${icon}</span>
          </div>
          <h4 class="font-bold text-slate-100 text-sm mb-1">${node.title}</h4>
          <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">${node.summary}</p>
        </div>
        
        <div class="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span class="font-mono text-cyan-400 font-bold">+${node.xp} XP</span>
          <span class="text-[10px] text-slate-400 uppercase font-semibold">${statusLabel}</span>
        </div>
      `;

      nodeCard.addEventListener('click', () => {
        openNodeModal({ ...node, isCompleted });
      });

      layerDiv.appendChild(nodeCard);
    });

    treeWrapper.appendChild(layerDiv);
  });

  container.appendChild(treeWrapper);

  // 3. Draw Connecting Curves between Layers
  setTimeout(() => drawBranchConnectors(roadmap), 100);
  window.addEventListener('resize', () => drawBranchConnectors(roadmap));
}

// Draws Smooth Curved Tree Connectors (Bezier Paths)
function drawBranchConnectors(roadmap) {
  const svg = document.getElementById('tree-svg-canvas');
  const wrapper = document.getElementById('tree-canvas-wrapper');
  if (!svg || !wrapper) return;

  svg.innerHTML = '';
  const wrapperRect = wrapper.getBoundingClientRect();

  roadmap.layers.forEach((layer, layerIdx) => {
    if (layerIdx >= roadmap.layers.length - 1) return;

    const nextLayer = roadmap.layers[layerIdx + 1];

    layer.forEach(parent => {
      const parentEl = document.getElementById(`node-${parent.id}`);
      if (!parentEl) return;

      const pRect = parentEl.getBoundingClientRect();
      const startX = (pRect.left + pRect.width / 2) - wrapperRect.left;
      const startY = pRect.bottom - wrapperRect.top;

      nextLayer.forEach(child => {
        const childEl = document.getElementById(`node-${child.id}`);
        if (!childEl) return;

        const cRect = childEl.getBoundingClientRect();
        const endX = (cRect.left + cRect.width / 2) - wrapperRect.left;
        const endY = cRect.top - wrapperRect.top;

        // Smooth cubic bezier S-curve
        const controlY1 = startY + (endY - startY) / 2;
        const controlY2 = startY + (endY - startY) / 2;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${startX} ${startY} C ${startX} ${controlY1}, ${endX} ${controlY2}, ${endX} ${endY}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#06b6d4');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '5, 5');
        path.setAttribute('opacity', '0.45');

        svg.appendChild(path);
      });
    });
  });
}

// Modal Trigger
function openNodeModal(node) {
  const modal = document.getElementById('node-modal');
  if (!modal) return;

  document.getElementById('modal-node-title').textContent = node.title;
  document.getElementById('modal-node-domain').textContent = node.domain;
  document.getElementById('modal-node-summary').textContent = node.summary;
  document.getElementById('modal-node-xp').textContent = `+${node.xp} XP`;

  const actionBtn = document.getElementById('modal-action-btn');
  if (node.isCompleted) {
    actionBtn.textContent = '✓ Node Mastered & Verified';
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