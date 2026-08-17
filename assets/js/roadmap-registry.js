window.RoadmapRegistry = {
  ...window.CyberSecurityRoadmaps,
  ...window.SoftwareRoadmaps,
  ...window.AIMLRoadmaps,
  ...window.CoreEngineeringRoadmaps,

  // Helper function to resolve the user's roadmap key from their Supabase profile
  resolveTrack(userDept = '') {
    const d = userDept.toLowerCase();

    if (d.includes('pentest') || d.includes('ethical') || d.includes('hack')) return 'cyber_pentester';
    if (d.includes('soc') || d.includes('defensive') || d.includes('blue')) return 'cyber_soc';
    if (d.includes('cyber')) return 'cyber_pentester';

    if (d.includes('devops') || d.includes('cloud') || d.includes('sre')) return 'sw_devops';
    if (d.includes('full') || d.includes('web') || d.includes('soft') || d.includes('cse')) return 'sw_fullstack';

    if (d.includes('ai') || d.includes('machine') || d.includes('data')) return 'ai_engineer';
    if (d.includes('embedded') || d.includes('iot') || d.includes('vlsi') || d.includes('electron')) return 'core_embedded';

    return 'cyber_pentester'; // Default fallback
  }
};