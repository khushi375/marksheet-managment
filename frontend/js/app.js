let students = [];

function resultFor(subjects) {
    const total = subjects.reduce((sum, subject) => sum + Number(subject.marks || 0), 0);
    const maxMarks = subjects.length * 100;
    const percentage = maxMarks ? Number(((total / maxMarks) * 100).toFixed(2)) : 0;
    const grade = !subjects.length ? "-" : percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 50 ? "D" : percentage >= 40 ? "E" : "F";
    return { total, maxMarks, percentage, grade, result: subjects.length ? (subjects.every(subject => Number(subject.marks) >= 40) ? "PASS" : "FAIL") : "PENDING" };
}
function selectedClassRequired() {
    const queryClassId = new URLSearchParams(window.location.search).get("classId");
    if (queryClassId && queryClassId !== getSelectedClassId()) {
        localStorage.setItem("selectedClassId", queryClassId);
    }

    const id = getSelectedClassId();
    if (!id) window.location.href = "classes.html";
    return id;
}
function handleAuthError(xhr) { if (xhr.status === 401) logout(); else showToast(xhr.responseJSON?.message || "Request failed", "danger"); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character])); }
function escapeAttribute(value) { return escapeHtml(value).replace(/'/g, "\\'"); }
function showToast(message, type = "success") { const toast = $(`<div class="alert alert-${type} app-toast">${escapeHtml(message)}</div>`).appendTo("body"); setTimeout(() => toast.fadeOut(300, () => toast.remove()), 3000); }

function loadStudents() {
    const classId = selectedClassRequired(); if (!classId) return;
    $("#currentClassName, #sidebarClassName").text(getSelectedClassName());
    $.ajax({ url: `${API_BASE}/students/class/${classId}`, headers: authHeaders(), success: response => { students = response.students || []; renderStudents(students); }, error: handleAuthError });
}
function renderStudents(records) {
    $("#recordCount").text(`${records.length} Records`);
    $("#studentTableBody").html(records.length ? records.map(student => { const result = resultFor(student.subjects || []); return `<tr><td>${escapeHtml(student.rollNumber)}</td><td>${escapeHtml(student.name)}</td><td>${escapeHtml(student.course)}</td><td>${student.semester}</td><td>${result.percentage}%</td><td>${result.result}</td><td><a class="btn btn-sm btn-outline-primary" href="add-marks.html?id=${student._id}"><i class="bi bi-pencil"></i></a> <a class="btn btn-sm btn-outline-secondary" href="marksheet.html?id=${student._id}"><i class="bi bi-file-earmark-text"></i></a> <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${student._id}')"><i class="bi bi-trash"></i></button></td></tr>`; }).join("") : '<tr><td colspan="7" class="empty-state">No student records found.</td></tr>');
}
function filterStudents(value) { const query = String(value).toLowerCase(); renderStudents(students.filter(student => [student.rollNumber, student.name, student.course].some(field => String(field).toLowerCase().includes(query)))); }
function deleteStudent(id) { if (!confirm("Are you sure you want to delete this student?")) return; $.ajax({ url: `${API_BASE}/students/${id}`, method: "DELETE", headers: authHeaders(), success: () => { loadStudents(); showToast("Student deleted successfully"); }, error: handleAuthError }); }
function subjectRow(subject = {}) { return `<div class="subject-row"><input type="text" class="form-control subject-name" placeholder="Subject name" value="${escapeAttribute(subject.subjectName || "")}"><input type="number" class="form-control subject-marks" min="0" max="100" placeholder="Marks" value="${subject.marks ?? ""}"><button type="button" class="btn btn-outline-danger remove-subject"><i class="bi bi-trash"></i></button></div>`; }
function readSubjects(container) { return $(`${container} .subject-row`).map(function () { return { subjectName: $(this).find(".subject-name").val().trim(), marks: Number($(this).find(".subject-marks").val()) }; }).get(); }

function initializeAddStudent() {
    const classId = selectedClassRequired(); if (!classId) return; $("#selectedClassName, #sidebarClassName").text(getSelectedClassName()); $("#addSubject").click(() => $("#subjectsContainer").append(subjectRow())); $(document).on("click", ".remove-subject", function () { if ($("#subjectsContainer .subject-row").length > 1) $(this).closest(".subject-row").remove(); });
    $("#studentForm").submit(function (event) { event.preventDefault(); $.ajax({ url: `${API_BASE}/students`, method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, data: JSON.stringify({ classId, rollNumber: $("#rollNumber").val(), name: $("#studentName").val(), email: $("#email").val(), course: $("#course").val(), semester: $("#semester").val(), subjects: readSubjects("#subjectsContainer").filter(subject => subject.subjectName) }), success: () => window.location.href = "students.html", error: xhr => showToast(xhr.responseJSON?.message || "Unable to add student", "danger") }); });
}
function loadMarksPage() {
    const id = new URLSearchParams(window.location.search).get("id"); if (!id) { window.location.href = "students.html"; return; }
    $.ajax({ url: `${API_BASE}/students/${id}`, headers: authHeaders(), success: response => { const student = response.student; $("#studentNameDisplay").text(student.name); $("#studentRollDisplay").text(student.rollNumber); $("#studentEmailDisplay").text(student.email); $("#studentCourseDisplay").text(student.course); $("#studentSemesterDisplay").text(student.semester); $("#marksContainer").html((student.subjects || []).map(subjectRow).join("") || subjectRow()); updateMarksPreview(); }, error: handleAuthError }); $("#addMarksSubject").click(() => { $("#marksContainer").append(subjectRow()); updateMarksPreview(); }); $(document).on("input", "#marksContainer .subject-marks", updateMarksPreview); $("#marksForm").submit(function (event) { event.preventDefault(); $.ajax({ url: `${API_BASE}/students/${id}/marks`, method: "PUT", headers: { ...authHeaders(), "Content-Type": "application/json" }, data: JSON.stringify({ subjects: readSubjects("#marksContainer") }), success: () => window.location.href = "students.html", error: xhr => showToast(xhr.responseJSON?.message || "Unable to save marks", "danger") }); });
}
function updateMarksPreview() { const result = resultFor(readSubjects("#marksContainer")); $("#marksTotal").text(`${result.total} / ${result.maxMarks}`); $("#marksPercentage").text(result.percentage ? `${result.percentage}%` : "-"); $("#marksGrade").text(result.grade); $("#marksResult").text(result.result); }
function initializeUpload() { const classId = selectedClassRequired(); if (!classId) return; $("#uploadClassName, #sidebarClassName").text(getSelectedClassName()); $("#uploadForm").submit(function (event) { event.preventDefault(); const file = $("#studentFile")[0].files[0]; if (!file) return; const data = new FormData(); data.append("studentFile", file); data.append("classId", classId); $.ajax({ url: `${API_BASE}/students/upload`, method: "POST", headers: authHeaders(), data, processData: false, contentType: false, success: response => $("#uploadResult").removeClass("d-none").text(`${response.imported} imported, ${response.skipped} skipped`), error: xhr => showToast(xhr.responseJSON?.message || "Upload failed", "danger") }); }); }
function loadMarksheet() { const id = new URLSearchParams(window.location.search).get("id"); if (!id) { window.location.href = "students.html"; return; } $.ajax({ url: `${API_BASE}/students/${id}`, headers: authHeaders(), success: response => { const student = response.student; const result = resultFor(student.subjects || []); $("#sheetClass").text(student.classId?.className || getSelectedClassName()); $("#sheetRollNumber").text(student.rollNumber); $("#sheetStudentName").text(student.name); $("#sheetEmail").text(student.email); $("#sheetCourse").text(student.course); $("#sheetSemester").text(student.semester); $("#marksheetSubjects").html((student.subjects || []).map((subject, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(subject.subjectName)}</td><td>${subject.marks}</td></tr>`).join("")); $("#sheetTotal").text(`${result.total} / ${result.maxMarks}`); $("#sheetPercentage").text(`${result.percentage}%`); $("#sheetGrade").text(result.grade); $("#sheetResult").text(result.result); $("#issueDate").text(new Date().toLocaleDateString()); }, error: handleAuthError }); }
