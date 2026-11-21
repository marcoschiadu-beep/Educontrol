// EduControl: aplicación CRUD académica con almacenamiento local.
const STORAGE_KEYS = { students: "educontrol_students", subjects: "educontrol_subjects", grades: "educontrol_grades" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const demoData = {
  students: [
    { id: "EST-001", name: "Laura Méndez", document: "1002456789", email: "laura@email.com", program: "Ingeniería de Software", semester: "4" },
    { id: "EST-002", name: "Daniel Rojas", document: "1003987654", email: "daniel@email.com", program: "Administración", semester: "3" },
    { id: "EST-003", name: "Camila Torres", document: "1005123456", email: "camila@email.com", program: "Ingeniería de Software", semester: "5" }
  ],
  subjects: [
    { id: "MAT-001", name: "Programación Web", code: "ISW204", credits: "3" },
    { id: "MAT-002", name: "Bases de Datos", code: "ISW205", credits: "4" },
    { id: "MAT-003", name: "Experiencia de Usuario", code: "ISW206", credits: "2" }
  ],
  grades: [
    { id: "NOT-001", studentId: "EST-001", subjectId: "MAT-001", score: "4.5" },
    { id: "NOT-002", studentId: "EST-002", subjectId: "MAT-002", score: "3.8" }
  ]
};

let data = {};
let currentType = "";
let editingId = null;
let toastTimer;

function loadData() {
  Object.keys(STORAGE_KEYS).forEach((type) => {
    const saved = localStorage.getItem(STORAGE_KEYS[type]);
    data[type] = saved === null ? [...demoData[type]] : JSON.parse(saved);
    if (saved === null) saveData(type);
  });
}
function saveData(type) {
  localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(data[type]));
}
function makeId(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function getStudent(id) { return data.students.find((item) => item.id === id); }
function getSubject(id) { return data.subjects.find((item) => item.id === id); }
function fullName(id) { return getStudent(id)?.name || "Estudiante eliminado"; }
function subjectName(id) { return getSubject(id)?.name || "Asignatura eliminada"; }
function initials(name) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }

function renderAll() {
  renderDashboard();
  renderStudents();
  renderSubjects();
  renderGrades();
}
function renderDashboard() {
  $("#statStudents").textContent = data.students.length;
  $("#statSubjects").textContent = data.subjects.length;
  const average = data.grades.length ? data.grades.reduce((sum, item) => sum + Number(item.score), 0) / data.grades.length : null;
  $("#statAverage").textContent = average === null ? "—" : average.toFixed(1);
  $("#recentStudents").innerHTML = data.students.slice(-4).reverse().map((student) => `
    <tr><td><div class="student-cell"><span class="mini-avatar">${escapeHTML(initials(student.name))}</span>${escapeHTML(student.name)}</div></td>
    <td>${escapeHTML(student.program)}</td><td>${escapeHTML(student.semester)}°</td></tr>`).join("") ||
    '<tr><td colspan="3">Todavía no hay estudiantes registrados.</td></tr>';
}
function renderStudents() {
  const query = ($("#studentSearch")?.value || "").toLowerCase().trim();
  const filtered = data.students.filter((s) => [s.name, s.document, s.email, s.program].some((v) => v.toLowerCase().includes(query)));
  $("#studentCount").textContent = `${filtered.length} ${filtered.length === 1 ? "registro" : "registros"}`;
  $("#studentsTable").innerHTML = filtered.map((s) => `
    <tr><td>${escapeHTML(s.id)}</td><td><div class="student-cell"><span class="mini-avatar">${escapeHTML(initials(s.name))}</span>${escapeHTML(s.name)}</div></td>
    <td>${escapeHTML(s.document)}</td><td>${escapeHTML(s.program)}</td><td>${escapeHTML(s.semester)}°</td>
    <td><div class="action-group"><button class="icon-button" data-edit="students" data-id="${escapeHTML(s.id)}">Editar</button><button class="icon-button delete" data-delete="students" data-id="${escapeHTML(s.id)}">Eliminar</button></div></td></tr>`).join("");
  $("#studentsEmpty").classList.toggle("hidden", filtered.length > 0);
  $("#studentsTable").closest(".table-wrap").classList.toggle("hidden", filtered.length === 0);
}
function renderSubjects() {
  const query = ($("#subjectSearch")?.value || "").toLowerCase().trim();
  const filtered = data.subjects.filter((s) => [s.name, s.code].some((v) => v.toLowerCase().includes(query)));
  $("#subjectCount").textContent = `${filtered.length} ${filtered.length === 1 ? "registro" : "registros"}`;
  $("#subjectsTable").innerHTML = filtered.map((s) => `
    <tr><td>${escapeHTML(s.code)}</td><td><strong>${escapeHTML(s.name)}</strong></td><td>${escapeHTML(s.credits)}</td>
    <td><div class="action-group"><button class="icon-button" data-edit="subjects" data-id="${escapeHTML(s.id)}">Editar</button><button class="icon-button delete" data-delete="subjects" data-id="${escapeHTML(s.id)}">Eliminar</button></div></td></tr>`).join("");
  $("#subjectsEmpty").classList.toggle("hidden", filtered.length > 0);
  $("#subjectsTable").closest(".table-wrap").classList.toggle("hidden", filtered.length === 0);
}
function renderGrades() {
  const query = ($("#gradeSearch")?.value || "").toLowerCase().trim();
  const filtered = data.grades.filter((g) => [fullName(g.studentId), subjectName(g.subjectId)].some((v) => v.toLowerCase().includes(query)));
  $("#gradeCount").textContent = `${filtered.length} ${filtered.length === 1 ? "registro" : "registros"}`;
  $("#gradesTable").innerHTML = filtered.map((g) => {
    const passed = Number(g.score) >= 3;
    return `<tr><td><strong>${escapeHTML(fullName(g.studentId))}</strong></td><td>${escapeHTML(subjectName(g.subjectId))}</td>
      <td><span class="grade-pill">${Number(g.score).toFixed(1)}</span></td><td class="${passed ? "state-pass" : "state-fail"}">${passed ? "Aprobado" : "Reprobado"}</td>
      <td><div class="action-group"><button class="icon-button" data-edit="grades" data-id="${escapeHTML(g.id)}">Editar</button><button class="icon-button delete" data-delete="grades" data-id="${escapeHTML(g.id)}">Eliminar</button></div></td></tr>`;
  }).join("");
  $("#gradesEmpty").classList.toggle("hidden", filtered.length > 0);
  $("#gradesTable").closest(".table-wrap").classList.toggle("hidden", filtered.length === 0);
}

const fieldDefinitions = {
  students: [
    { name: "name", label: "Nombre completo", placeholder: "Ej. Andrea Pérez", full: true },
    { name: "document", label: "Documento", placeholder: "Número de documento" },
    { name: "email", label: "Correo electrónico", type: "email", placeholder: "correo@ejemplo.com" },
    { name: "program", label: "Programa académico", placeholder: "Ej. Ingeniería de Software", full: true },
    { name: "semester", label: "Semestre", type: "select", options: Array.from({ length: 10 }, (_, i) => [String(i + 1), `${i + 1}° semestre`]) }
  ],
  subjects: [
    { name: "name", label: "Nombre de la asignatura", placeholder: "Ej. Programación Web", full: true },
    { name: "code", label: "Código", placeholder: "Ej. ISW204" },
    { name: "credits", label: "Créditos", type: "select", options: Array.from({ length: 8 }, (_, i) => [String(i + 1), `${i + 1} créditos`]) }
  ],
  grades: [
    { name: "studentId", label: "Estudiante", type: "select", options: () => data.students.map((s) => [s.id, s.name]), full: true },
    { name: "subjectId", label: "Asignatura", type: "select", options: () => data.subjects.map((s) => [s.id, s.name]), full: true },
    { name: "score", label: "Calificación (0.0 a 5.0)", type: "number", placeholder: "Ej. 4.2", min: "0", max: "5", step: "0.1", full: true }
  ]
};
const typeLabels = { students: "estudiante", subjects: "asignatura", grades: "calificación" };
function openModal(type, id = null) {
  currentType = type;
  editingId = id;
  const existing = id ? data[type].find((item) => item.id === id) : {};
  const definitions = fieldDefinitions[type];
  $("#modalTitle").textContent = `${id ? "Editar" : "Nuevo"} ${typeLabels[type]}`;
  $("#formError").classList.add("hidden");
  $("#formFields").innerHTML = definitions.map((field) => {
    let control;
    if (field.type === "select") {
      const options = typeof field.options === "function" ? field.options() : field.options;
      control = `<select id="field-${field.name}" name="${field.name}" required><option value="">Selecciona una opción</option>${options.map(([value, label]) => `<option value="${escapeHTML(value)}" ${existing[field.name] === value ? "selected" : ""}>${escapeHTML(label)}</option>`).join("")}</select>`;
    } else {
      control = `<input id="field-${field.name}" name="${field.name}" type="${field.type || "text"}" placeholder="${escapeHTML(field.placeholder || "")}" value="${escapeHTML(existing[field.name] || "")}" ${field.min !== undefined ? `min="${field.min}" max="${field.max}" step="${field.step}"` : ""} required>`;
    }
    return `<div class="field ${field.full ? "full" : ""}"><label for="field-${field.name}">${field.label}</label>${control}</div>`;
  }).join("");
  $("#modalBackdrop").classList.remove("hidden");
  const first = $("#formFields input, #formFields select");
  first?.focus();
}
function closeModal() { $("#modalBackdrop").classList.add("hidden"); $("#recordForm").reset(); }
function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const record = Object.fromEntries(formData.entries());
  for (const [key, value] of Object.entries(record)) {
    if (!value.trim()) return showFormError("Completa todos los campos antes de guardar.");
  }
  if (currentType === "students") {
    if (!/^\S+@\S+\.\S+$/.test(record.email)) return showFormError("Ingresa un correo electrónico válido.");
    if (data.students.some((s) => s.document === record.document && s.id !== editingId)) return showFormError("Ya existe un estudiante con ese documento.");
  }
  if (currentType === "subjects" && data.subjects.some((s) => s.code.toLowerCase() === record.code.toLowerCase() && s.id !== editingId)) return showFormError("Ya existe una asignatura con ese código.");
  if (currentType === "grades" && (Number(record.score) < 0 || Number(record.score) > 5 || !Number.isFinite(Number(record.score)))) return showFormError("La calificación debe estar entre 0.0 y 5.0.");
  if (editingId) {
    const index = data[currentType].findIndex((item) => item.id === editingId);
    data[currentType][index] = { ...data[currentType][index], ...record };
    notify(`${typeLabels[currentType]} actualizado correctamente.`);
  } else {
    const prefix = { students: "EST", subjects: "MAT", grades: "NOT" }[currentType];
    data[currentType].push({ id: makeId(prefix), ...record });
    notify(`${typeLabels[currentType]} registrado correctamente.`);
  }
  saveData(currentType);
  closeModal();
  renderAll();
}
function showFormError(message) {
  $("#formError").textContent = message;
  $("#formError").classList.remove("hidden");
}
function deleteRecord(type, id) {
  const record = data[type].find((item) => item.id === id);
  if (!record || !confirm(`¿Estás seguro de eliminar este registro (${typeLabels[type]})?`)) return;
  if (type === "students") {
    data.grades = data.grades.filter((grade) => grade.studentId !== id);
    saveData("grades");
  }
  if (type === "subjects") {
    data.grades = data.grades.filter((grade) => grade.subjectId !== id);
    saveData("grades");
  }
  data[type] = data[type].filter((item) => item.id !== id);
  saveData(type);
  renderAll();
  notify(`${typeLabels[type][0].toUpperCase()}${typeLabels[type].slice(1)} eliminado.`);
}
function navigate(view) {
  $$(".view").forEach((section) => section.classList.toggle("active", section.id === `view-${view}`));
  $$(".nav-link").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  const labels = { dashboard: "Dashboard", students: "Estudiantes", subjects: "Asignaturas", grades: "Calificaciones" };
  $("#breadcrumbCurrent").textContent = labels[view];
  $("#sidebar").classList.remove("open");
}
function setupEvents() {
  $$(".nav-link").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.view)));
  $$("[data-go]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.go)));
  $("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#addStudentBtn").addEventListener("click", () => openModal("students"));
  $("#addSubjectBtn").addEventListener("click", () => openModal("subjects"));
  $("#addGradeBtn").addEventListener("click", () => {
    if (!data.students.length || !data.subjects.length) return notify("Primero registra al menos un estudiante y una asignatura.");
    openModal("grades");
  });
  $$("[data-open-student]").forEach((b) => b.addEventListener("click", () => openModal("students")));
  $$("[data-open-subject]").forEach((b) => b.addEventListener("click", () => openModal("subjects")));
  $$("[data-open-grade]").forEach((b) => b.addEventListener("click", () => {
    if (data.students.length && data.subjects.length) openModal("grades");
    else notify("Primero registra estudiantes y asignaturas.");
  }));
  $("#closeModal").addEventListener("click", closeModal);
  $("#cancelModal").addEventListener("click", closeModal);
  $("#modalBackdrop").addEventListener("click", (event) => { if (event.target.id === "modalBackdrop") closeModal(); });
  $("#recordForm").addEventListener("submit", handleFormSubmit);
  $("#studentSearch").addEventListener("input", renderStudents);
  $("#subjectSearch").addEventListener("input", renderSubjects);
  $("#gradeSearch").addEventListener("input", renderGrades);
  document.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit]");
    const deleteButton = event.target.closest("[data-delete]");
    if (editButton) openModal(editButton.dataset.edit, editButton.dataset.id);
    if (deleteButton) deleteRecord(deleteButton.dataset.delete, deleteButton.dataset.id);
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
}

function initializeApp() {
  loadData();
  $("#todayDate").textContent = new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date());
  setupEvents();
  renderAll();
}
document.addEventListener("DOMContentLoaded", initializeApp);
