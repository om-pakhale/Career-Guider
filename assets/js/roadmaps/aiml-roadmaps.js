window.AIMLRoadmaps = {
  // Track 1: AI & Deep Learning Engineer
  "ai_engineer": {
    title: "AI & Machine Learning Engineer",
    description: "Python and Linear Algebra branch into Classical ML, Deep Neural Networks, and GenAI Agents, converging into Production MLOps Model Deploy.",
    layers: [
      [
        { id: "ai-base", title: "Python, NumPy & Vector Math", domain: "Foundation", xp: 250, status: "completed", summary: "Matrix multiplications, broadcasting, gradient descent, and Pandas." }
      ],
      [
        { id: "ai-ml", title: "Supervised & Unsupervised ML", domain: "Algorithms", xp: 500, status: "active", summary: "Regression, Decision Trees, XGBoost, Scikit-Learn pipelines, and cross-validation." },
        { id: "ai-dl", title: "Neural Networks & PyTorch", domain: "Deep Learning", xp: 750, status: "locked", summary: "Backprop, activation functions, CNNs for Vision, and RNNs." },
        { id: "ai-genai", title: "LLM Agents & RAG Systems", domain: "GenAI", xp: 800, status: "locked", summary: "Vector databases, embedding chunking, prompt pipelines, and LangChain." }
      ],
      [
        { id: "ai-mlops", title: "MLOps & Model Serving", domain: "Production", xp: 850, status: "locked", summary: "FastAPI inference microservices, model quantisation (ONNX), and tracking." }
      ],
      [
        { id: "ai-capstone", title: "Autonomous Multimodal AI Agent", domain: "Capstone", xp: 1500, status: "locked", summary: "Deploy an end-to-end real-time AI microservice with active continuous learning." }
      ]
    ]
  }
};