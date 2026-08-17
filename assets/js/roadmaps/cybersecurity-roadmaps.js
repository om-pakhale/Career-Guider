window.CyberSecurityRoadmaps = {
  // Track 1: Offensive Security & Penetration Testing
  "cyber_pentester": {
    title: "Penetration Tester & Ethical Hacker",
    description: "Linux shell and networking diverge into Web Exploitation, Network Attacks, and Binary Triage, converging into Capstone Network Intrusion.",
    layers: [
      [
        { id: "pentest-base", title: "Linux Internals & Bash", domain: "Foundation", xp: 250, status: "completed", summary: "File system hierarchy, system calls, permissions, and shell scripting." }
      ],
      [
        { id: "pentest-web", title: "Web Vulnerability Triage", domain: "Web Security", xp: 500, status: "active", summary: "OWASP Top 10, IDOR, BOLA, SQLi injection, and XSS exploitation." },
        { id: "pentest-net", title: "Network Sniffing & Port Recon", domain: "Network Security", xp: 450, status: "active", summary: "Nmap, Wireshark, packet capture, and MITM vector analysis." },
        { id: "pentest-ad", title: "Active Directory Exploitation", domain: "Infrastructure", xp: 600, status: "locked", summary: "Kerberoasting, Pass-the-Hash, BloodHound mapping, and DC enumeration." }
      ],
      [
        { id: "pentest-adv", title: "Privilege Escalation & AV Bypass", domain: "Exploitation", xp: 850, status: "locked", summary: "Kernel exploits, SUID binaries, PowerShell evasion, and payload crafting." },
        { id: "pentest-report", title: "Threat Modeling & Remediation", domain: "Consulting", xp: 700, status: "locked", summary: "CVSS v3.1 scoring, executive report drafting, and remediation validation." }
      ],
      [
        { id: "pentest-capstone", title: "Enterprise Red Team Simulation", domain: "Capstone", xp: 1500, status: "locked", summary: "End-to-end network penetration test, proof of concept, and disclosure report." }
      ]
    ]
  },

  // Track 2: SOC Analyst & Defensive Security
  "cyber_soc": {
    title: "SOC Analyst & Incident Responder",
    description: "System logs and network capture diverge into SIEM Monitoring, Digital Forensics, and Threat Intel, converging into SOC Breach Response.",
    layers: [
      [
        { id: "soc-base", title: "Windows & Linux Event Logs", domain: "Foundation", xp: 250, status: "completed", summary: "Sysmon, Event Viewer, syslog-ng, and kernel audit logs." }
      ],
      [
        { id: "soc-siem", title: "SIEM & Splunk Rule Design", domain: "Monitoring", xp: 500, status: "active", summary: "Querying ELK/Splunk, correlating events, and writing alert rules." },
        { id: "soc-threat", title: "MITRE ATT&CK Mapping", domain: "Threat Intel", xp: 450, status: "locked", summary: "Tactics, techniques, procedures (TTPs), and threat hunting frameworks." },
        { id: "soc-forensics", title: "Memory & Disk Forensics", domain: "Forensics", xp: 600, status: "locked", summary: "Volatility memory analysis, FTK Imager, and artifact extraction." }
      ],
      [
        { id: "soc-ir", title: "Incident Response Playbooks", domain: "Blue Team", xp: 800, status: "locked", summary: "Ransomware containment, live host isolation, and chain of custody." }
      ],
      [
        { id: "soc-capstone", title: "Live Enterprise Breach Defense", domain: "Capstone", xp: 1500, status: "locked", summary: "Contain multi-stage APT compromise and conduct post-incident forensics." }
      ]
    ]
  }
};