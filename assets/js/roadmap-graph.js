
const skillTreeData = {
  layers: [
    
    [
      {
        id: 'node-foundations',
        title: 'CS & Terminal Basics',
        domain: 'Foundation',
        xp: 250,
        status: 'completed', 
        summary: 'Linux shell navigation, Git fundamentals, and binary/data representation.',
        next: ['node-fe-basics', 'node-be-basics', 'node-sec-basics']
      }
    ],
   
    [
      {
        id: 'node-fe-basics',
        title: 'Modern Frontend & UI',
        domain: 'Frontend Branch',
        xp: 400,
        status: 'completed',
        summary: 'Semantic HTML5, CSS layout engines, responsive design, and DOM manipulation.',
        next: ['node-fe-adv']
      },
      {
        id: 'node-be-basics',
        title: 'Server & DB Architecture',
        domain: 'Backend Branch',
        xp: 500,
        status: 'active',
        summary: 'RESTful APIs, PostgreSQL schemas, query indexing, and connection pools.',
        next: ['node-be-adv']
      },
      {
        id: 'node-sec-basics',
        title: 'Networking & TCP/IP',
        domain: 'Security Branch',
        xp: 450,
        status: 'active',
        summary: 'Subnetting, packet routing, TLS/SSL handshakes, and firewall rules.',
        next: ['node-sec-adv']
      }
    ],
    [
      {
        id: 'node-fe-adv',
        title: 'State & Client Performance',
        domain: 'Frontend Branch',
        xp: 600,
        status: 'locked',
        summary: 'Component lifecycles, global state stores, bundling, and client caching.',
        next: ['node-capstone']
      },
      {
        id: 'node-be-adv',
        title: 'Microservices & Auth Tokens',
        domain: 'Backend Branch',
        xp: 750,
        status: 'locked',
        summary: 'JWT authentication, session revocation, message queues, and worker threads.',
        next: ['node-capstone']
      },
      {
        id: 'node-sec-adv',
        title: 'Vulnerability Assessment',
        domain: 'Security Branch',
        xp: 800,
        status: 'locked',
        summary: 'OWASP Top 10 mitigation, BOLA/IDOR triage, and input sanitization audits.',
        next: ['node-capstone']
      }
    ],
    [
      {
        id: 'node-capstone',
        title: 'Production Capstone Deploy',
        domain: 'Master Goal',
        xp: 1500,
        status: 'locked',
        summary: 'Full-stack end-to-end deployment with automated CI/CD, threat modeling, and live metrics.',
        next: []
      }
    ]
  ]
};


function renderSkillTreeGraph(graphData) {
  const container = document.getElementById('skill-tree-container');
  if (!container) return;

  container.innerHTML = '';

  graphData.layers.forEach((layer, layerIdx) => {
    const layerDiv = document.createElement('div');
    layerDiv.className = 'flex justify-around items-center w-full gap-4 my-8';

    layer.forEach((node) => {
      const nodeCard = document.createElement('div');
      nodeCard.id = node.id;
      
      let borderGlow = 'border-slate-800 bg-slate-950/60 opacity-60';
      let badgeColor = 'bg-slate-800 text-slate-400';
      let icon = 'lock';

      if (node.status === 'completed') {
        borderGlow = 'border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer';
        badgeColor = 'bg-emerald-950 text-emerald-400 border border-emerald-800';
        icon = 'check_circle';
      } else if (node.status === 'active') {
        borderGlow = 'border-cyan-400 bg-slate-900 border-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-pulse cursor-pointer';
        badgeColor = 'bg-cyan-950 text-cyan-300 border border-cyan-800';
        icon = 'play_arrow';
      }

      nodeCard.className = `p-4 rounded-xl border ${borderGlow} transition-all duration-300 hover:scale-105 w-64 text-left flex flex-col justify-between`;
      nodeCard.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor} uppercase tracking-wider">${node.domain}</span>
          <span class="material-symbols-outlined text-sm ${node.status === 'completed' ? 'text-emerald-400' : (node.status === 'active' ? 'text-cyan-400' : 'text-slate-500')}">${icon}</span>
        </div>
        <h4 class="font-bold text-slate-200 text-sm mb-1">${node.title}</h4>
        <p class="text-[11px] text-slate-400 line-clamp-2">${node.summary}</p>
        <div class="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
          <span class="font-mono text-cyan-400 font-bold">+${node.xp} XP</span>
          <span class="text-[10px] text-slate-400 uppercase font-semibold">${node.status}</span>
        </div>
      `;

      nodeCard.addEventListener('click', () => {
        openNodeModal(node);
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
  if (node.status === 'active') {
    actionBtn.textContent = 'Launch Lab Task / Quiz ➔';
    actionBtn.disabled = false;
    actionBtn.className = 'w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs transition';
  } else if (node.status === 'completed') {
    actionBtn.textContent = 'Review Node Notes';
    actionBtn.disabled = false;
    actionBtn.className = 'w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition';
  } else {
    actionBtn.textContent = '🔒 Prerequisites Required';
    actionBtn.disabled = true;
    actionBtn.className = 'w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-500 font-bold rounded-xl text-xs cursor-not-allowed';
  }

  modal.classList.remove('hidden');
}

function closeNodeModal() {
  const modal = document.getElementById('node-modal');
  if (modal) modal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  renderSkillTreeGraph(skillTreeData);
});