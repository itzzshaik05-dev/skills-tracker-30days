// app.js

// --- 30-day plan data structure ---
// You can edit this object to change tasks or add more details.
// Each day has: id, title, focus, goals, timeAllocation (subtasks), resources, tasks, assessment, notes.
const planData = [
  {
    id: 1,
    week: 1,
    coreRoleTag: null, // "embedded", "hardware", "fpga", "test" as needed
    title: "Day 1 – Aptitude + Programming + ECE basics",
    focus: "Percentages, C/Python refresher, Ohm’s law",
    goals: [
      "Set up dev environment and recall basic syntax.",
      "Refresh arithmetic and percentages.",
      "Review basic circuit concepts like Ohm’s law."
    ],
    timeAllocation: [
      { label: "Aptitude – arithmetic & percentages", minutes: 40 },
      { label: "Programming – C/Python syntax refresher", minutes: 40 },
      { label: "ECE – Ohm’s law & circuit elements", minutes: 40 }
    ],
    resources: [
      "GeeksforGeeks Aptitude – Arithmetic & Percentage pages",
      "GeeksforGeeks C or Python Language tutorials",
      "NPTEL Basic Electrical Circuits intro lectures"
    ],
    tasks: [
      "Solve 10 percentage questions.",
      "Write a simple C/Python program to add two numbers and compute percentage.",
      "Solve 3 Ohm’s law circuit examples."
    ],
    assessment: "Can solve ≥7/10 percentage questions, compile a simple program, and apply Ohm’s law correctly once."
  },
  // --- You would continue filling days 2–30 similarly ---
  // For brevity here, I’ll add one more example and then generic entries.
  {
    id: 3,
    week: 1,
    coreRoleTag: "hardware",
    title: "Day 3 – Time & work, arrays, diodes",
    focus: "Time & work aptitude, arrays basics, diode behavior",
    goals: [
      "Understand standard time & work formulas.",
      "Implement array traversal and basic operations.",
      "Explain forward and reverse bias of a diode."
    ],
    timeAllocation: [
      { label: "Aptitude – time & work", minutes: 40 },
      { label: "Programming – arrays traversal", minutes: 40 },
      { label: "ECE – diode characteristics", minutes: 40 }
    ],
    resources: [
      "GeeksforGeeks Time and Work page",
      "GeeksforGeeks arrays tutorial (C/Python)",
      "NPTEL or Electronics Tutorials on diodes basics"
    ],
    tasks: [
      "Solve 10 time & work questions.",
      "Write program to find max/min and sum of an array.",
      "Draw diode circuit and label forward/reverse bias."
    ],
    assessment: "Can solve ≥7/10 time & work questions, implement array operations, and explain diode behavior."
  }
  // In your final version, expand days 2–30 based on the roadmap above.
];

// --- Progress state ---
// We store per-day state: completed, partialProgress (0-100), notes.
const STORAGE_KEY = "ece30_plan_progress";

let progressState = {};

// Load from localStorage if available
function loadProgress() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      progressState = JSON.parse(stored);
    } catch (e) {
      progressState = {};
    }
  } else {
    progressState = {};
  }
}

// Save to localStorage
function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
}

// Initialize default state
function ensureState(dayId) {
  if (!progressState[dayId]) {
    progressState[dayId] = {
      completed: false,
      partialProgress: 0,
      notes: ""
    };
  }
}

// --- Rendering ---
function renderDays() {
  const container = document.getElementById("days-container");
  container.innerHTML = "";

  planData.forEach(day => {
    ensureState(day.id);
    const state = progressState[day.id];

    const card = document.createElement("div");
    card.className = "day-card";
    card.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "day-header";
    header.tabIndex = 0;
    header.setAttribute("aria-expanded", "false");

    const title = document.createElement("h3");
    title.textContent = `Day ${day.id} – ${day.focus}`;
    header.appendChild(title);

    const status = document.createElement("p");
    status.className = "status";
    status.textContent = state.completed
      ? "Status: Completed"
      : state.partialProgress > 0
      ? `Status: In progress (${state.partialProgress}%)`
      : "Status: Not started";
    header.appendChild(status);

    const details = document.createElement("div");
    details.className = "day-details";

    const meta = document.createElement("div");
    meta.className = "day-meta";
    meta.textContent = `Week ${day.week} | Focus/Topics: ${day.focus}`;
    details.appendChild(meta);

    const goals = document.createElement("div");
    goals.className = "goals";
    goals.innerHTML = "<strong>Specific learning goals:</strong>";
    const goalsList = document.createElement("ul");
    day.goals.forEach(g => {
      const li = document.createElement("li");
      li.textContent = g;
      goalsList.appendChild(li);
    });
    goals.appendChild(goalsList);
    details.appendChild(goals);

    const timeDiv = document.createElement("div");
    timeDiv.className = "time-allocation";
    timeDiv.innerHTML = "<strong>Time allocation (120 minutes):</strong>";
    const timeList = document.createElement("ul");
    day.timeAllocation.forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.label} – ${t.minutes} min`;
      timeList.appendChild(li);
    });
    timeDiv.appendChild(timeList);
    details.appendChild(timeDiv);

    const resDiv = document.createElement("div");
    resDiv.className = "resources";
    resDiv.innerHTML = "<strong>Resources:</strong>";
    const resList = document.createElement("ul");
    day.resources.forEach(r => {
      const li = document.createElement("li");
      li.textContent = r;
      resList.appendChild(li);
    });
    resDiv.appendChild(resList);
    details.appendChild(resDiv);

    const tasksDiv = document.createElement("div");
    tasksDiv.className = "tasks";
    tasksDiv.innerHTML = "<strong>Practice tasks:</strong>";
    const tasksList = document.createElement("ul");
    day.tasks.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      tasksList.appendChild(li);
    });
    tasksDiv.appendChild(tasksList);
    details.appendChild(tasksDiv);

    const assessDiv = document.createElement("div");
    assessDiv.className = "assessment";
    assessDiv.innerHTML = `<strong>Mini-assessment:</strong> ${day.assessment}`;
    details.appendChild(assessDiv);

    const controls = document.createElement("div");
    controls.className = "controls";

    const completeLabel = document.createElement("label");
    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.checked = state.completed;
    completeCheckbox.addEventListener("change", () => {
      state.completed = completeCheckbox.checked;
      if (state.completed) {
        state.partialProgress = 100;
      }
      saveProgress();
      updateSummary();
      renderDays();
    });
    completeLabel.appendChild(completeCheckbox);
    completeLabel.appendChild(document.createTextNode("Mark complete"));
    controls.appendChild(completeLabel);

    const partialLabel = document.createElement("label");
    partialLabel.textContent = "Partial progress (%) ";
    const partialInput = document.createElement("input");
    partialInput.type = "number";
    partialInput.min = "0";
    partialInput.max = "100";
    partialInput.value = state.partialProgress;
    partialInput.addEventListener("change", () => {
      const val = parseInt(partialInput.value, 10) || 0;
      state.partialProgress = Math.max(0, Math.min(100, val));
      if (state.partialProgress === 100) {
        state.completed = true;
      }
      saveProgress();
      updateSummary();
      renderDays();
    });
    partialLabel.appendChild(partialInput);
    controls.appendChild(partialLabel);

    details.appendChild(controls);

    const notesDiv = document.createElement("div");
    notesDiv.className = "notes";
    const notesLabel = document.createElement("label");
    notesLabel.textContent = "Notes:";
    notesLabel.setAttribute("for", `notes-${day.id}`);
    const notesTextarea = document.createElement("textarea");
    notesTextarea.id = `notes-${day.id}`;
    notesTextarea.value = state.notes;
    notesTextarea.addEventListener("input", () => {
      state.notes = notesTextarea.value;
      saveProgress();
    });
    notesDiv.appendChild(notesLabel);
    notesDiv.appendChild(notesTextarea);
    details.appendChild(notesDiv);

    header.addEventListener("click", () => {
      const isOpen = details.classList.contains("open");
      details.classList.toggle("open");
      header.setAttribute("aria-expanded", String(!isOpen));
    });

    header.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });

    card.appendChild(header);
    card.appendChild(details);
    container.appendChild(card);
  });
}

// --- Summary ---
function updateSummary() {
  const daysCompletedEl = document.getElementById("days-completed");
  const percentEl = document.getElementById("percent-complete");
  const weeklyStatusEl = document.getElementById("weekly-status");

  let completedCount = 0;
  let sumPercent = 0;

  planData.forEach(day => {
    const s = progressState[day.id];
    if (!s) return;
    if (s.completed) completedCount += 1;
    sumPercent += s.partialProgress || 0;
  });

  const overallPercent =
    planData.length > 0 ? Math.round(sumPercent / planData.length) : 0;

  daysCompletedEl.textContent = String(completedCount);
  percentEl.textContent = `${overallPercent}%`;

  // Weekly milestone messages (simple, based on completion)
  if (completedCount >= 7 && completedCount < 14) {
    weeklyStatusEl.textContent = "Week 1 milestone likely achieved: basics in aptitude, programming, and ECE.";
  } else if (completedCount >= 14 && completedCount < 21) {
    weeklyStatusEl.textContent = "Week 2 milestone: DSA basics, digital logic, and microcontrollers in progress.";
  } else if (completedCount >= 21 && completedCount < 28) {
    weeklyStatusEl.textContent = "Week 3 milestone: embedded project and interview questions being solidified.";
  } else if (completedCount >= 28) {
    weeklyStatusEl.textContent = "Week 4 milestone: mock tests and interviews, you’re close to placement-ready.";
  } else {
    weeklyStatusEl.textContent = "Week milestones will update as you complete more days.";
  }
}

// --- Export/Import ---
// Export progress as JSON file
function exportJSON() {
  const dataStr = JSON.stringify(progressState, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ece30_progress.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Export progress as CSV file
function exportCSV() {
  const rows = [["dayId", "completed", "partialProgress", "notes"]];
  planData.forEach(day => {
    const s = progressState[day.id] || { completed: false, partialProgress: 0, notes: "" };
    rows.push([
      day.id,
      s.completed ? "1" : "0",
      s.partialProgress,
      `"${(s.notes || "").replace(/"/g, '""')}"`
    ]);
  });
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ece30_progress.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Import JSON/CSV file
function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;
    if (file.name.endsWith(".json")) {
      try {
        const obj = JSON.parse(text);
        progressState = obj;
        saveProgress();
        updateSummary();
        renderDays();
      } catch (e) {
        alert("Invalid JSON file.");
      }
    } else if (file.name.endsWith(".csv")) {
      const lines = text.split(/\r?\n/);
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(",");
        const dayId = parseInt(parts[0], 10);
        const completed = parts[1] === "1";
        const partial = parseInt(parts[2], 10) || 0;
        const notes = parts.slice(3).join(",").replace(/^"|"$/g, "").replace(/""/g, '"');
        ensureState(dayId);
        progressState[dayId].completed = completed;
        progressState[dayId].partialProgress = partial;
        progressState[dayId].notes = notes;
      }
      saveProgress();
      updateSummary();
      renderDays();
    } else {
      alert("Unsupported file type. Use .json or .csv.");
    }
  };
  reader.readAsText(file);
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  loadProgress();
  renderDays();
  updateSummary();

  document
    .getElementById("export-json-btn")
    .addEventListener("click", exportJSON);
  document
    .getElementById("export-csv-btn")
    .addEventListener("click", exportCSV);
  document
    .getElementById("import-file")
    .addEventListener("change", handleImportFile);
  document
    .getElementById("import-json-btn")
    .addEventListener("click", () => {
      document.getElementById("import-file").click();
    });
});
