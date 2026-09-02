$(document).ready(function () {

    protectPage();

    loadClasses();

    $("#saveClass").click(
        createClass
    );

});


function loadClasses() {

    $.ajax({

        url:
            API_BASE +
            "/classes",

        method: "GET",

        headers:
            authHeaders(),

        success: function (response) {

            renderClasses(
                response.classes || []
            );
        },

        error: function (xhr) {

            if (
                xhr.status === 401
            ) {

                logout();

                return;
            }

            showToast(
                "Unable to load classes",
                "danger"
            );
        }
    });
}


function renderClasses(
    classes
) {

    const container =
        $("#classesContainer");

    container.empty();

    if (!classes.length) {

        container.html(`
            <div class="empty-state-large">
                <i class="bi bi-mortarboard"></i>
                <h4>No Classes Yet</h4>
                <p>
                    Create your first class to begin managing examination records.
                </p>
            </div>
        `);

        return;
    }

    classes.forEach(function (item) {

        container.append(`

            <div class="class-card">

                <div class="class-icon">
                    <i class="bi bi-mortarboard-fill"></i>
                </div>

                <div class="class-info">

                    <h5>
                        ${escapeHtml(
                            item.className
                        )}
                    </h5>

                    <p>
                        <i class="bi bi-people"></i>
                        ${item.studentCount || 0}
                        Students
                    </p>

                </div>

                <div class="class-actions">

                    <button
                        class="btn btn-primary"
                        onclick="openClass(
                            '${item._id}',
                            '${escapeAttribute(
                                item.className
                            )}'
                        )">

                        Open Class
                        <i class="bi bi-arrow-right"></i>

                    </button>

                    <button
                        class="btn btn-outline-danger btn-sm"
                        onclick="deleteClass(
                            '${item._id}'
                        )">

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            </div>
        `);
    });
}


function createClass() {

    const className =
        $("#className")
            .val()
            .trim();

    if (!className) {

        showToast(
            "Please enter class name",
            "danger"
        );

        return;
    }

    $("#saveClass")
        .prop("disabled", true)
        .html(
            '<span class="spinner-border spinner-border-sm"></span> Saving...'
        );

    $.ajax({

        url:
            API_BASE +
            "/classes",

        method: "POST",

        headers:
            authHeaders(),

        contentType:
            "application/json",

        data:
            JSON.stringify({
                className
            }),

        success: function () {

            $("#saveClass")
                .prop(
                    "disabled",
                    false
                )
                .text(
                    "Save Class"
                );

            $("#className")
                .val("");

            bootstrap.Modal
                .getOrCreateInstance(
                    document.getElementById(
                        "addClassModal"
                    )
                )
                .hide();

            loadClasses();

            showToast(
                "Class created successfully",
                "success"
            );
        },

        error: function (xhr) {

            $("#saveClass")
                .prop(
                    "disabled",
                    false
                )
                .text(
                    "Save Class"
                );

            showToast(
                xhr.responseJSON?.message ||
                "Unable to create class",
                "danger"
            );
        }
    });
}


function openClass(id, name) {
    setSelectedClass(id, name);

    window.location.assign(`./students.html?classId=${encodeURIComponent(id)}`);
}
function deleteClass(id) {

    if (
        !confirm(
            "Are you sure you want to delete this class?"
        )
    ) {
        return;
    }

    $.ajax({

        url:
            API_BASE +
            "/classes/" +
            id,

        method: "DELETE",

        headers:
            authHeaders(),

        success: function () {

            loadClasses();

            showToast(
                "Class deleted successfully",
                "success"
            );
        },

        error: function (xhr) {

            showToast(
                xhr.responseJSON?.message ||
                "Unable to delete class",
                "danger"
            );
        }
    });
}


function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


function escapeAttribute(
    value
) {

    return String(value)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );
}


function showToast(
    message,
    type = "success"
) {

    const toast =
        $(`
        <div class="alert alert-${type} app-toast">
            ${escapeHtml(message)}
        </div>
    `);

    $("body").append(toast);

    setTimeout(
        function () {
            toast.fadeOut(
                300,
                function () {
                    $(this).remove();
                }
            );
        },
        3000
    );
}