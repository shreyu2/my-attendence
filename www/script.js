import {
    auth,
    googleProvider
} from "./firebase.js";

import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    userName.textContent =
        user.displayName || user.email;

});


/* =========================
   GOOGLE AUTH ELEMENTS
========================= */

const googleLoginBtn =
    document.getElementById("googleLoginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const userInfo =
    document.getElementById("userInfo");

const userName =
    document.getElementById("userName");


/* =========================
   GOOGLE LOGIN
========================= */

googleLoginBtn.addEventListener(
    "click",
    async () => {

        try {

            await signInWithPopup(
                auth,
                googleProvider
            );

        } catch (error) {

            console.error(
                "Google login failed:",
                error
            );

            alert(
                "Google login failed. Please try again."
            );

        }

    }
);


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        }

    }
);


/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            googleLoginBtn.style.display =
                "none";

            userInfo.classList.remove(
                "hidden"
            );

            userName.textContent =
                user.displayName ||
                user.email;

        } else {

            googleLoginBtn.style.display =
                "block";

            userInfo.classList.add(
                "hidden"
            );

            userName.textContent = "";

        }

    }
);


/* =========================
   LOCAL STORAGE
========================= */

const STORAGE_KEY =
    "attendanceTrackerData";


let subjects =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEY
        )
    ) || [];


let threshold =
    Number(
        localStorage.getItem(
            "attendanceThreshold"
        )
    ) || 85;


/* =========================
   ELEMENTS
========================= */

const subjectsContainer =
    document.getElementById(
        "subjectsContainer"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const addSubjectBtn =
    document.getElementById(
        "addSubjectBtn"
    );


const modal =
    document.getElementById(
        "modal"
    );


const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );


const saveSubjectBtn =
    document.getElementById(
        "saveSubjectBtn"
    );


const subjectNameInput =
    document.getElementById(
        "subjectName"
    );


const attendedInput =
    document.getElementById(
        "attended"
    );


const conductedInput =
    document.getElementById(
        "conducted"
    );


const modalError =
    document.getElementById(
        "modalError"
    );


const thresholdInput =
    document.getElementById(
        "threshold"
    );


thresholdInput.value =
    threshold;


/* =========================
   SAVE DATA
========================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(subjects)
    );


    localStorage.setItem(
        "attendanceThreshold",
        threshold
    );

}


/* =========================
   CALCULATE PERCENTAGE
========================= */

function calculatePercentage(
    attended,
    conducted
) {

    if (conducted === 0) {

        return 0;

    }


    return (
        attended /
        conducted
    ) * 100;

}


/* =========================
   CALCULATE SAFE SKIPS
========================= */

function calculateSafeSkips(
    attended,
    conducted
) {

    if (conducted === 0) {

        return 0;

    }


    let skips = 0;


    while (

        (
            (
                attended /
                (
                    conducted +
                    skips +
                    1
                )
            ) * 100
        ) >= threshold

    ) {

        skips++;

    }


    return skips;

}


/* =========================
   CALCULATE RECOVERY
========================= */

function calculateRecoveryClasses(
    attended,
    conducted
) {

    if (conducted === 0) {

        return 0;

    }


    const currentPercentage =
        calculatePercentage(
            attended,
            conducted
        );


    if (
        currentPercentage >=
        threshold
    ) {

        return 0;

    }


    let classesNeeded = 0;


    while (

        (
            (
                attended +
                classesNeeded
            ) /
            (
                conducted +
                classesNeeded
            )
        ) * 100 < threshold

    ) {

        classesNeeded++;

    }


    return classesNeeded;

}


/* =========================
   RENDER SUBJECTS
========================= */

function renderSubjects() {

    subjectsContainer.innerHTML =
        "";


    if (
        subjects.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    subjects.forEach(
        (subject) => {

            const percentage =
                calculatePercentage(
                    subject.attended,
                    subject.conducted
                );


            const safeSkips =
                calculateSafeSkips(
                    subject.attended,
                    subject.conducted
                );


            const recovery =
                calculateRecoveryClasses(
                    subject.attended,
                    subject.conducted
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "subject-card";


            let progressClass = "";


            if (
                percentage <
                threshold
            ) {

                progressClass =
                    "danger";

            } else if (
                percentage <
                threshold + 5
            ) {

                progressClass =
                    "warning";

            }


            const progressWidth =
                Math.min(
                    percentage,
                    100
                );


            card.innerHTML = `

                <div class="subject-header">

                    <h2>
                        ${escapeHTML(
                            subject.name
                        )}
                    </h2>

                    <div class="attendance-percentage">
                        ${percentage.toFixed(2)}%
                    </div>

                </div>


                <div class="attendance-details">

                    ${subject.attended}

                    attended out of

                    ${subject.conducted}

                    classes

                </div>


                <div class="progress-container">

                    <div
                        class="progress-bar ${progressClass}"
                        style="width: ${progressWidth}%"
                    ></div>

                </div>


                <div class="subject-info">

                    <div class="info-box">

                        <div class="info-label">
                            Target
                        </div>

                        <div class="info-value">
                            ${threshold}%
                        </div>

                    </div>


                    <div class="info-box">

                        <div class="info-label">
                            Can Skip
                        </div>

                        <div class="info-value">
                            ${safeSkips} classes
                        </div>

                    </div>


                    <div class="info-box">

                        <div class="info-label">
                            Need to Attend
                        </div>

                        <div class="info-value">
                            ${recovery} classes
                        </div>

                    </div>


                    <div class="info-box">

                        <div class="info-label">
                            Status
                        </div>

                        <div class="info-value">

                            ${
                                percentage >= threshold
                                    ? "Above Target"
                                    : "Below Target"
                            }

                        </div>

                    </div>

                </div>


                <div class="subject-actions">

                    <button
                        class="present-btn"
                        onclick="markPresent('${subject.id}')"
                    >
                        Present
                    </button>


                    <button
                        class="absent-btn"
                        onclick="markAbsent('${subject.id}')"
                    >
                        Absent
                    </button>


                    <button
                        class="secondary-btn"
                        onclick="editAttendance('${subject.id}')"
                    >
                        Edit Attendance
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteSubject('${subject.id}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            subjectsContainer.appendChild(
                card
            );

        }
    );

}


/* =========================
   PRESENT
========================= */

function markPresent(id) {

    const subject =
        subjects.find(
            (item) =>
                item.id === id
        );


    if (!subject) {

        return;

    }


    subject.attended++;

    subject.conducted++;


    saveData();

    renderSubjects();

}


/* =========================
   ABSENT
========================= */

function markAbsent(id) {

    const subject =
        subjects.find(
            (item) =>
                item.id === id
        );


    if (!subject) {

        return;

    }


    subject.conducted++;


    saveData();

    renderSubjects();

}


/* =========================
   ADD SUBJECT MODAL
========================= */

addSubjectBtn.addEventListener(
    "click",
    () => {

        subjectNameInput.value =
            "";

        attendedInput.value =
            "";

        conductedInput.value =
            "";

        modalError.textContent =
            "";

        modal.classList.remove(
            "hidden"
        );

        subjectNameInput.focus();

    }
);


/* =========================
   CLOSE MODAL
========================= */

cancelBtn.addEventListener(
    "click",
    () => {

        modal.classList.add(
            "hidden"
        );

    }
);


/* =========================
   SAVE SUBJECT
========================= */

saveSubjectBtn.addEventListener(
    "click",
    () => {

        const name =
            subjectNameInput.value.trim();


        const attended =
            Number(
                attendedInput.value
            );


        const conducted =
            Number(
                conductedInput.value
            );


        if (!name) {

            modalError.textContent =
                "Please enter a subject name.";

            return;

        }


        if (
            !Number.isInteger(
                attended
            ) ||
            attended < 0
        ) {

            modalError.textContent =
                "Enter a valid attended class count.";

            return;

        }


        if (
            !Number.isInteger(
                conducted
            ) ||
            conducted < 0
        ) {

            modalError.textContent =
                "Enter a valid conducted class count.";

            return;

        }


        if (
            attended >
            conducted
        ) {

            modalError.textContent =
                "Attended classes cannot be greater than conducted classes.";

            return;

        }


        const subject = {

            id:
                Date.now().toString(),

            name,

            attended,

            conducted

        };


        subjects.push(
            subject
        );


        saveData();

        renderSubjects();


        modal.classList.add(
            "hidden"
        );

    }
);


/* =========================
   EDIT ATTENDANCE
========================= */

function editAttendance(id) {

    const subject =
        subjects.find(
            (item) =>
                item.id === id
        );


    if (!subject) {

        return;

    }


    const attended =
        prompt(
            `Classes attended for ${subject.name}:`,
            subject.attended
        );


    if (
        attended === null
    ) {

        return;

    }


    const conducted =
        prompt(
            `Classes conducted for ${subject.name}:`,
            subject.conducted
        );


    if (
        conducted === null
    ) {

        return;

    }


    const newAttended =
        Number(attended);


    const newConducted =
        Number(conducted);


    if (

        !Number.isInteger(
            newAttended
        ) ||

        !Number.isInteger(
            newConducted
        ) ||

        newAttended < 0 ||

        newConducted < 0

    ) {

        alert(
            "Please enter valid numbers."
        );

        return;

    }


    if (
        newAttended >
        newConducted
    ) {

        alert(
            "Attended classes cannot be greater than conducted classes."
        );

        return;

    }


    subject.attended =
        newAttended;


    subject.conducted =
        newConducted;


    saveData();

    renderSubjects();

}


/* =========================
   DELETE SUBJECT
========================= */

function deleteSubject(id) {

    const subject =
        subjects.find(
            (item) =>
                item.id === id
        );


    if (!subject) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${subject.name}?`
        );


    if (!confirmed) {

        return;

    }


    subjects =
        subjects.filter(
            (item) =>
                item.id !== id
        );


    saveData();

    renderSubjects();

}


/* =========================
   THRESHOLD
========================= */

thresholdInput.addEventListener(
    "change",
    () => {

        let value =
            Number(
                thresholdInput.value
            );


        if (value < 1) {

            value = 1;

        }


        if (value > 100) {

            value = 100;

        }


        threshold =
            value;


        thresholdInput.value =
            threshold;


        saveData();

        renderSubjects();

    }
);


/* =========================
   HTML ESCAPE
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================
   MAKE INLINE BUTTONS WORK
========================= */

window.markPresent =
    markPresent;

window.markAbsent =
    markAbsent;

window.editAttendance =
    editAttendance;

window.deleteSubject =
    deleteSubject;


/* =========================
   INITIAL RENDER
========================= */

renderSubjects();