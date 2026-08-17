window.CoreEngineeringRoadmaps = {
  // Track 1: Embedded Systems & IoT
  "core_embedded": {
    title: "Embedded Systems & IoT Engineer",
    description: "C/C++ and digital logic branch into Microcontrollers, RTOS, and Communication Protocols, converging into Custom Embedded Device Capstone.",
    layers: [
      [
        { id: "emb-base", title: "Embedded C & Memory Layout", domain: "Foundation", xp: 250, status: "completed", summary: "Pointers, memory-mapped I/O, bitwise masks, and compilation pipeline." }
      ],
      [
        { id: "emb-proto", title: "Hardware Protocols (UART/SPI/I2C)", domain: "Protocols", xp: 500, status: "active", summary: "Logic analyzer debugging, timing diagrams, and sensor interfacing." },
        { id: "emb-rtos", title: "FreeRTOS & Kernel Tasks", domain: "Firmware", xp: 700, status: "locked", summary: "Task preemption, semaphores, mutexes, and interrupt service routines." },
        { id: "emb-pcb", title: "Schematic & PCB Layout", domain: "Hardware", xp: 600, status: "locked", summary: "KiCad routing, component decoupling, ground planes, and design for manufacturing." }
      ],
      [
        { id: "emb-iot", title: "Secure IoT & MQTT / BLE", domain: "Connectivity", xp: 800, status: "locked", summary: "Secure bootloaders, Over-The-Air (OTA) firmware updates, and TLS." }
      ],
      [
        { id: "emb-capstone", title: "Production Smart Hardware System", domain: "Capstone", xp: 1500, status: "locked", summary: "Fabricate PCB board with customized firmware and encrypted cloud link." }
      ]
    ]
  }
};