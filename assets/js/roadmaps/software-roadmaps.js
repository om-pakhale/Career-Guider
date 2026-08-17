window.SoftwareRoadmaps = {
  // Track 1: Full-Stack Engineer
  "sw_fullstack": {
    title: "Full-Stack Software Engineer",
    description: "Modern JavaScript and CS foundations branch into Frontend State, REST/GraphQL APIs, and Relational DBs, converging into Scalable SaaS Capstone.",
    layers: [
      [
        { id: "fs-base", title: "Data Structures & Async JS", domain: "Foundation", xp: 250, status: "completed", summary: "Event loop, closures, hash tables, sorting algorithms, and Git." }
      ],
      [
        { id: "fs-fe", title: "Component Systems & UI", domain: "Frontend", xp: 450, status: "active", summary: "Reactive state, routing, virtual DOM, Tailwind, and accessibility." },
        { id: "fs-be", title: "Node.js / Go Backend APIs", domain: "Backend", xp: 500, status: "active", summary: "Middleware architecture, JWT auth, input validation, and rate limiting." },
        { id: "fs-db", title: "PostgreSQL & Database Design", domain: "Database", xp: 450, status: "locked", summary: "Relational indexing, connection pooling, ACID transactions, and RLS." }
      ],
      [
        { id: "fs-cache", title: "Redis Caching & Sockets", domain: "Scalability", xp: 750, status: "locked", summary: "In-memory stores, Pub/Sub channels, WebSockets, and queue workers." },
        { id: "fs-ci", title: "Docker & Cloud Deployments", domain: "DevOps", xp: 700, status: "locked", summary: "Multi-stage Docker builds, GitHub Actions CI/CD, and reverse proxies." }
      ],
      [
        { id: "fs-capstone", title: "Multi-Tenant SaaS Deployment", domain: "Capstone", xp: 1500, status: "locked", summary: "Production application with end-to-end authentication, stripe billing, and monitoring." }
      ]
    ]
  },

  // Track 2: DevOps & Site Reliability Engineer (SRE)
  "sw_devops": {
    title: "DevOps & Cloud Architect",
    description: "Linux systems branch into Infrastructure as Code, Kubernetes Orchestration, and Observability, converging into Production Cloud Cluster.",
    layers: [
      [
        { id: "devops-base", title: "Linux Networking & Shell", domain: "Foundation", xp: 250, status: "completed", summary: "Kernel parameters, IP tables, SSH keys, and systemd units." }
      ],
      [
        { id: "devops-iac", title: "Terraform & Cloud Infra", domain: "IaC", xp: 550, status: "active", summary: "AWS/GCP VPCs, subnets, IAM security roles, and state management." },
        { id: "devops-k8s", title: "Kubernetes & Containers", domain: "Containers", xp: 650, status: "locked", summary: "Pods, services, ingress controllers, Helm charts, and persistent volumes." },
        { id: "devops-obs", title: "Prometheus & Grafana", domain: "Observability", xp: 450, status: "locked", summary: "Metrics collection, tracing with OpenTelemetry, and alert managers." }
      ],
      [
        { id: "devops-mesh", title: "Service Mesh & Zero Trust", domain: "Platform", xp: 850, status: "locked", summary: "Istio mTLS, traffic splitting, canary releases, and GitOps with ArgoCD." }
      ],
      [
        { id: "devops-capstone", title: "High-Availability Multi-Region Cluster", domain: "Capstone", xp: 1500, status: "locked", summary: "Deploy self-healing, auto-scaling Kubernetes cluster with automated failover." }
      ]
    ]
  }
};