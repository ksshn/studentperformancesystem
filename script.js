// Sample Quiz Data in JSON format
const quizzesData = [
    {
        id: 1,
        title: "Mathematics Basics",
        description: "Test your math skills",
        questions: [
            {
                question: "What is 15 + 27?",
                options: ["42", "43", "40", "44"],
                correct: 0
            },
            {
                question: "What is 100 ÷ 5?",
                options: ["15", "20", "25", "30"],
                correct: 1
            },
            {
                question: "What is 12 × 8?",
                options: ["86", "94", "96", "100"],
                correct: 2
            },
            {
                question: "What is 50 - 18?",
                options: ["32", "30", "28", "35"],
                correct: 0
            },
            {
                question: "What is 7²?",
                options: ["42", "49", "56", "63"],
                correct: 1
            }
        ]
    },
    {
        id: 2,
        title: "General Knowledge",
        description: "Expand your knowledge",
        questions: [
            {
                question: "What is the capital of France?",
                options: ["Lyon", "Paris", "Marseille", "Toulouse"],
                correct: 1
            },
            {
                question: "Which planet is closest to the sun?",
                options: ["Venus", "Mercury", "Earth", "Mars"],
                correct: 1
            },
            {
                question: "Who wrote Romeo and Juliet?",
                options: ["Christopher Marlowe", "William Shakespeare", "Ben Jonson", "John Webster"],
                correct: 1
            },
            {
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                correct: 3
            },
            {
                question: "In what year did World War II end?",
                options: ["1943", "1944", "1945", "1946"],
                correct: 2
            }
        ]
    },
    {
        id: 3,
        title: "Science & Technology",
        description: "Challenge your tech knowledge",
        questions: [
            {
                question: "What does HTML stand for?",
                options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
                correct: 0
            },
            {
                question: "What is the chemical symbol for Gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                correct: 2
            },
            {
                question: "How many bytes are in a gigabyte?",
                options: ["1000", "1,000,000", "1,000,000,000", "1,000,000,000,000"],
                correct: 2
            },
            {
                question: "What is the speed of light approximately?",
                options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
                correct: 0
            },
            {
                question: "Who invented the Internet?",
                options: ["Bill Gates", "Steve Jobs", "Vint Cerf and Bob Kahn", "Tim Berners-Lee"],
                correct: 2
            }
        ]
    }
];

// Global Variables
let students = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;
let selectedAnswers = [];
let quizStartTime = 0;
let quizTimerInterval = null;
let achievements = {
    firstQuiz: false,
    perfect100: false,
    threeQuizzes: false,
    topScorer: false,
    speedDemon: false
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    setupThemeToggle();
    setupNavigation();
    renderDashboard();
    renderQuizzes();
    renderStudents();
    renderLeaderboard();
    renderAchievements();
    updateAnalytics();
    populateStudentDropdown();
});

// Load data from localStorage (JSON storage)
function loadDataFromStorage() {
    const savedData = localStorage.getItem('studentPerformanceData');
    const savedAchievements = localStorage.getItem('studentAchievements');
    const savedTheme = localStorage.getItem('appTheme');
    
    if (savedData) {
        students = JSON.parse(savedData);
    } else {
        students = [
            { id: 1, name: "Alice Johnson", score: 85, quizzesCompleted: 2, lastActivity: "Completed Science Quiz", attendance: [] },
            { id: 2, name: "Bob Smith", score: 92, quizzesCompleted: 3, lastActivity: "Completed Math Quiz", attendance: [] },
            { id: 3, name: "Carol White", score: 78, quizzesCompleted: 1, lastActivity: "Started General Knowledge", attendance: [] }
        ];
        saveDataToStorage();
    }
    
    if (savedAchievements) {
        achievements = JSON.parse(savedAchievements);
    }
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '☀️';
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('studentPerformanceData', JSON.stringify(students));
    localStorage.setItem('studentAchievements', JSON.stringify(achievements));
}

// Theme Toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('appTheme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// Get Grade Letter
function getGradeLetter(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

// Setup Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            navigateToSection(sectionName);
        });
    });
}

// Navigate between sections
function navigateToSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById(sectionName).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === sectionName) {
            btn.classList.add('active');
        }
    });

    if (sectionName === 'analytics') {
        updateAnalytics();
    } else if (sectionName === 'achievements') {
        renderAchievements();
    } else if (sectionName === 'leaderboard') {
        renderLeaderboard();
    }
}

// Render Dashboard
function renderDashboard() {
    if (students.length === 0) {
        document.getElementById('totalStudents').textContent = '0';
        document.getElementById('avgScore').textContent = '0%';
        document.getElementById('topPerformer').textContent = '-';
        document.getElementById('quizzesCompleted').textContent = '0';
        document.getElementById('recentActivities').innerHTML = '<p style="text-align: center; color: #999;">No activities yet</p>';
        return;
    }

    const totalStudents = students.length;
    const avgScore = Math.round(students.reduce((sum, s) => sum + s.score, 0) / totalStudents);
    const topStudent = students.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
    );
    const totalQuizzes = students.reduce((sum, s) => sum + s.quizzesCompleted, 0);

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('avgScore').textContent = avgScore + '%';
    document.getElementById('topPerformer').textContent = topStudent.name;
    document.getElementById('quizzesCompleted').textContent = totalQuizzes;

    const activitiesHTML = students
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(student => `
            <div class="activity-item">
                <strong>${student.name}</strong> - Score: ${student.score}% <span class="grade-badge ${getGradeLetter(student.score).toLowerCase()}">${getGradeLetter(student.score)}</span>
                <br>
                <span class="activity-time">${student.lastActivity || 'No activity'}</span>
            </div>
        `).join('');
    
    document.getElementById('recentActivities').innerHTML = activitiesHTML;
}

// Add a new student
function addStudent() {
    const nameInput = document.getElementById('studentName');
    const scoreInput = document.getElementById('studentScore');

    const name = nameInput.value.trim();
    const score = parseInt(scoreInput.value);

    if (!name) {
        alert('Please enter a student name');
        return;
    }

    if (isNaN(score) || score < 0 || score > 100) {
        alert('Please enter a valid score between 0 and 100');
        return;
    }

    const newStudent = {
        id: Date.now(),
        name: name,
        score: score,
        quizzesCompleted: 0,
        lastActivity: 'Added to system',
        attendance: []
    };

    students.push(newStudent);
    saveDataToStorage();

    nameInput.value = '';
    scoreInput.value = '';

    renderStudents();
    renderDashboard();
    renderLeaderboard();
    populateStudentDropdown();
}

// Render Students List
function renderStudents() {
    const studentsList = document.getElementById('studentsList');
    
    if (students.length === 0) {
        studentsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No students added yet</p>';
        populateStudentDropdown();
        return;
    }

    const studentsHTML = students.map(student => {
        const grade = getGradeLetter(student.score);
        return `
            <div class="student-card">
                <h4>${student.name}</h4>
                <div class="student-score">${student.score}%</div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${student.score}%"></div>
                </div>
                <p style="color: #999; margin-bottom: 15px;">Quizzes: ${student.quizzesCompleted}</p>
                <span class="grade-badge ${grade.toLowerCase()}">${grade}</span>
                <p style="color: #666; font-size: 0.9em; margin-bottom: 15px; margin-top: 10px;">${student.lastActivity}</p>
                <button class="btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
            </div>
        `;
    }).join('');

    studentsList.innerHTML = studentsHTML;
    populateStudentDropdown();
}

// Search Students
function searchStudents() {
    const searchTerm = document.getElementById('searchStudent').value.toLowerCase();
    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm)
    );

    if (searchTerm === '') {
        renderStudents();
    } else {
        const studentsHTML = filteredStudents.map(student => {
            const grade = getGradeLetter(student.score);
            return `
                <div class="student-card">
                    <h4>${student.name}</h4>
                    <div class="student-score">${student.score}%</div>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${student.score}%"></div>
                    </div>
                    <p style="color: #999; margin-bottom: 15px;">Quizzes: ${student.quizzesCompleted}</p>
                    <span class="grade-badge ${grade.toLowerCase()}">${grade}</span>
                    <p style="color: #666; font-size: 0.9em; margin-bottom: 15px; margin-top: 10px;">${student.lastActivity}</p>
                    <button class="btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
                </div>
            `;
        }).join('');

        document.getElementById('studentsList').innerHTML = studentsHTML;
    }
}

// Render Leaderboard
function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    
    if (students.length === 0) {
        leaderboardList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No students in leaderboard yet</p>';
        return;
    }

    const sortedStudents = [...students].sort((a, b) => b.score - a.score);
    
    const medals = ['🥇', '🥈', '🥉'];
    
    const leaderboardHTML = sortedStudents.map((student, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        const medal = rank <= 3 ? medals[rank - 1] : rank;
        const grade = getGradeLetter(student.score);
        
        return `
            <div class="leaderboard-item" style="animation-delay: ${index * 0.1}s;">
                <div class="leaderboard-rank ${rankClass}">
                    ${rank}
                </div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${student.name}</div>
                    <div class="leaderboard-stats">Quizzes: ${student.quizzesCompleted} | Grade: <span class="grade-badge ${grade.toLowerCase()}">${grade}</span></div>
                </div>
                <div class="leaderboard-score">${student.score}%</div>
                <div class="leaderboard-medal">${medal}</div>
            </div>
        `;
    }).join('');

    leaderboardList.innerHTML = leaderboardHTML;
}

// Delete a student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        saveDataToStorage();
        renderStudents();
        renderDashboard();
        renderLeaderboard();
    }
}

// Render Quizzes
function renderQuizzes() {
    const quizList = document.getElementById('quizList');
    
    const icons = ['🔢', '🌍', '🧪'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    
    const quizzesHTML = quizzesData.map((quiz, index) => `
        <div class="quiz-card" onclick="startQuiz(${quiz.id})">
            <div class="quiz-card-header">${icons[index] || '📚'}</div>
            <h4>${quiz.title}</h4>
            <p>${quiz.description}</p>
            <p style="margin-top: 12px; font-size: 0.9em; opacity: 0.9;">📝 ${quiz.questions.length} Questions</p>
            <div class="quiz-difficulty">${difficulties[index % difficulties.length]}</div>
        </div>
    `).join('');

    quizList.innerHTML = quizzesHTML;
}

// Start Quiz
function startQuiz(quizId) {
    currentQuiz = quizzesData.find(q => q.id === quizId);
    currentQuestionIndex = 0;
    quizScore = 0;
    selectedAnswers = [];
    quizStartTime = Date.now();

    document.getElementById('quizStartMenu').style.display = 'none';
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';

    document.getElementById('quizTitle').textContent = currentQuiz.title;
    document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
    document.getElementById('timerValue').textContent = '0';
    document.getElementById('quizProgressBar').style.width = '0%';
    
    // Reset timer styling
    const timerElement = document.getElementById('quizTimer');
    timerElement.classList.remove('warning', 'danger');

    startQuizTimer();
    showQuestion();
}

// Quiz Timer
function startQuizTimer() {
    let seconds = 0;
    const timerValue = document.getElementById('timerValue');
    
    quizTimerInterval = setInterval(() => {
        seconds++;
        timerValue.textContent = seconds;
        
        const timerElement = document.getElementById('quizTimer');
        if (seconds > 120) {
            timerElement.classList.add('danger');
        } else if (seconds > 60) {
            timerElement.classList.add('warning');
        }
    }, 1000);
}

// Show Current Question
function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    
    document.getElementById('questionNumber').textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    const progressPercentage = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    document.getElementById('quizProgressBar').style.width = progressPercentage + '%';

    const questionHTML = `
        <div class="question-text">${question.question}</div>
        <div class="options">
            ${question.options.map((option, index) => `
                <button class="option-btn" onclick="selectAnswer(${index})">${option}</button>
            `).join('')}
        </div>
        <button class="btn-primary btn-next" onclick="nextQuestion()" style="display: none;" id="nextBtn">
            ${currentQuestionIndex === currentQuiz.questions.length - 1 ? '🎯 Submit Quiz' : '➜ Next Question'}
        </button>
    `;

    document.getElementById('questionContainer').innerHTML = questionHTML;
}

// Select Answer
function selectAnswer(optionIndex) {
    const question = currentQuiz.questions[currentQuestionIndex];
    selectedAnswers[currentQuestionIndex] = optionIndex;

    // Disable all option buttons
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === optionIndex && optionIndex !== question.correct) {
            btn.classList.add('incorrect');
        }
    });

    // Show next button
    document.getElementById('nextBtn').style.display = 'block';

    // Update score
    if (optionIndex === question.correct) {
        quizScore++;
    }
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    clearInterval(quizTimerInterval);
    
    const totalQuestions = currentQuiz.questions.length;
    const scorePercentage = Math.round((quizScore / totalQuestions) * 100);
    const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);
    const grade = getGradeLetter(scorePercentage);

    achievements.firstQuiz = true;
    if (scorePercentage === 100) achievements.perfect100 = true;
    
    students.forEach((student, index) => {
        if (student.quizzesCompleted === 0) {
            student.score = scorePercentage;
        } else {
            student.score = Math.round((student.score + scorePercentage) / 2);
        }
        student.quizzesCompleted++;
        if (student.quizzesCompleted >= 3) achievements.threeQuizzes = true;
        student.lastActivity = `Completed ${currentQuiz.title} - ${scorePercentage}%`;
        
        // Record attendance for this quiz
        if (!student.attendance) student.attendance = [];
        student.attendance.push({
            quizId: currentQuiz.id,
            quizTitle: currentQuiz.title,
            date: new Date().toLocaleDateString(),
            score: scorePercentage,
            grade: grade,
            time: new Date().toLocaleTimeString()
        });
    });

    saveDataToStorage();
    renderDashboard();
    renderLeaderboard();

    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';
    document.getElementById('finalScore').textContent = scorePercentage + '%';
    document.getElementById('correctCount').textContent = quizScore;
    document.getElementById('totalCount').textContent = totalQuestions;
    document.getElementById('timeTaken').textContent = timeTaken;

    const gradeDisplay = document.getElementById('gradeDisplay');
    gradeDisplay.textContent = grade;
    gradeDisplay.classList.remove('grade-a', 'grade-b', 'grade-c', 'grade-d');
    gradeDisplay.classList.add(`grade-${grade.toLowerCase()}`);

    let achievementMsg = '';
    if (scorePercentage === 100) {
        achievementMsg = '🌟 Perfect Score! Amazing work!';
    } else if (scorePercentage >= 90) {
        achievementMsg = '⭐ Excellent performance!';
    } else if (scorePercentage >= 80) {
        achievementMsg = '👏 Great job!';
    } else if (scorePercentage >= 70) {
        achievementMsg = '✓ Good effort!';
    } else {
        achievementMsg = '💪 Keep practicing!';
    }
    document.getElementById('achievementMessage').textContent = achievementMsg;

    if (scorePercentage >= 80) {
        createConfetti();
    }
}

// Back to Quiz Menu
function backToQuizMenu() {
    currentQuiz = null;
    currentQuestionIndex = 0;
    quizScore = 0;
    selectedAnswers = [];
    clearInterval(quizTimerInterval);

    document.getElementById('quizStartMenu').style.display = 'grid';
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizResults').style.display = 'none';
    
    document.getElementById('quizTimer').classList.remove('warning', 'danger');
}

// Confetti Animation
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['c1', 'c2', 'c3', 'c4', 'c5'];
    
    for (let i = 0; i < 50; i++) {
        const confetto = document.createElement('div');
        confetto.className = `confetti ${colors[Math.floor(Math.random() * colors.length)]}`;
        
        const xPos = Math.random() * window.innerWidth;
        const yPos = Math.random() * window.innerHeight;
        
        confetto.style.left = xPos + 'px';
        confetto.style.top = yPos + 'px';
        confetto.style.animationDuration = (2 + Math.random() * 1) + 's';
        confetto.style.animationDelay = (Math.random() * 0.3) + 's';
        
        container.appendChild(confetto);
        
        setTimeout(() => confetto.remove(), 3000);
    }
}

// Render Achievements
function renderAchievements() {
    const performanceBadges = document.getElementById('performanceBadges');
    const milestones = document.getElementById('milestones');
    const specialAchievements = document.getElementById('specialAchievements');

    const totalStudents = students.length;
    const completedQuizzes = students.reduce((sum, s) => sum + s.quizzesCompleted, 0);

    const performanceHTML = `
        <div class="achievement-badge ${totalStudents >= 5 ? 'unlocked' : 'locked'}">
            <div class="badge-icon">👥</div>
            <div class="badge-name">Team Builder</div>
            <div class="badge-description">Add 5 students</div>
        </div>
        <div class="achievement-badge ${students.some(s => s.score >= 90) ? 'unlocked' : 'locked'}">
            <div class="badge-icon">⭐</div>
            <div class="badge-name">Star Performer</div>
            <div class="badge-description">Score 90%+</div>
        </div>
        <div class="achievement-badge ${students.some(s => s.score === 100) ? 'unlocked' : 'locked'}">
            <div class="badge-icon">💯</div>
            <div class="badge-name">Perfect Score</div>
            <div class="badge-description">Get 100%</div>
        </div>
    `;

    const milestonesHTML = `
        <div class="achievement-badge ${completedQuizzes >= 1 ? 'unlocked' : 'locked'}">
            <div class="badge-icon">1️⃣</div>
            <div class="badge-name">Quiz Starter</div>
            <div class="badge-description">Complete 1 quiz</div>
        </div>
        <div class="achievement-badge ${completedQuizzes >= 5 ? 'unlocked' : 'locked'}">
            <div class="badge-icon">5️⃣</div>
            <div class="badge-name">Quiz Enthusiast</div>
            <div class="badge-description">Complete 5 quizzes</div>
        </div>
        <div class="achievement-badge ${completedQuizzes >= 10 ? 'unlocked' : 'locked'}">
            <div class="badge-icon">🔟</div>
            <div class="badge-name">Quiz Master</div>
            <div class="badge-description">Complete 10 quizzes</div>
        </div>
    `;

    const avgScore = totalStudents > 0 ? Math.round(students.reduce((sum, s) => sum + s.score, 0) / totalStudents) : 0;

    const specialHTML = `
        <div class="achievement-badge ${avgScore >= 80 ? 'unlocked' : 'locked'}">
            <div class="badge-icon">📈</div>
            <div class="badge-name">Rising Star</div>
            <div class="badge-description">Avg score 80%+</div>
        </div>
        <div class="achievement-badge ${totalStudents > 0 && students.every(s => s.quizzesCompleted > 0) && totalStudents >= 3 ? 'unlocked' : 'locked'}">
            <div class="badge-icon">🎯</div>
            <div class="badge-name">All Engaged</div>
            <div class="badge-description">All students took quiz</div>
        </div>
    `;

    performanceBadges.innerHTML = performanceHTML;
    milestones.innerHTML = milestonesHTML;
    specialAchievements.innerHTML = specialHTML;
}

// Update Analytics
function updateAnalytics() {
    if (students.length === 0) {
        document.getElementById('performanceChart').innerHTML = '<p style="text-align: center; color: #999;">No data available</p>';
        document.getElementById('scoreTable').innerHTML = '<p style="text-align: center; color: #999;">No data available</p>';
        return;
    }

    const maxScore = 100;
    const chartHTML = students.slice(0, 8).map(student => {
        const height = (student.score / maxScore) * 200;
        return `
            <div class="chart-bar" style="height: ${height}px; align-self: flex-end;">
                <div class="chart-label">${student.name.split(' ')[0]}</div>
            </div>
        `;
    }).join('');

    document.getElementById('performanceChart').innerHTML = chartHTML;

    const sortedStudents = [...students].sort((a, b) => b.score - a.score);
    const grade = (score) => getGradeLetter(score);

    const tableHTML = `
        <div class="table-header">
            <div class="table-cell">Student Name</div>
            <div class="table-cell">Score</div>
            <div class="table-cell">Grade</div>
        </div>
        ${sortedStudents.map(student => `
            <div class="table-row">
                <div class="table-cell">${student.name}</div>
                <div class="table-cell"><strong>${student.score}%</strong></div>
                <div class="table-cell"><span class="grade-badge ${grade(student.score).toLowerCase()}">${grade(student.score)}</span></div>
            </div>
        `).join('')}
    `;

    document.getElementById('scoreTable').innerHTML = tableHTML;
}

// Populate Student Dropdown for Info Page
function populateStudentDropdown() {
    const select = document.getElementById('studentSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select a Student --</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        select.appendChild(option);
    });
}

// Display Student Information & Attendance
function displayStudentInfo() {
    const select = document.getElementById('studentSelect');
    const studentId = select.value;
    const infoCard = document.getElementById('studentInfoCard');
    const noSelection = document.getElementById('noStudentSelected');
    
    if (!studentId) {
        infoCard.style.display = 'none';
        noSelection.style.display = 'block';
        return;
    }
    
    const student = students.find(s => s.id == studentId);
    if (!student) return;
    
    // Calculate attendance rate
    const attendanceRate = student.attendance && student.attendance.length > 0 
        ? Math.round((student.attendance.length / quizzesData.length) * 100) 
        : 0;
    
    // Update student info
    document.getElementById('infoName').textContent = student.name;
    document.getElementById('infoId').textContent = `ID: ${student.id}`;
    document.getElementById('infoScore').textContent = `${student.score}%`;
    document.getElementById('infoQuizzes').textContent = student.quizzesCompleted || 0;
    document.getElementById('infoAttendance').textContent = `${attendanceRate}%`;
    document.getElementById('infoGrade').textContent = getGradeLetter(student.score);
    
    // Build attendance history
    const attendanceList = document.getElementById('attendanceList');
    if (student.attendance && student.attendance.length > 0) {
        const attendanceHTML = student.attendance.map(att => `
            <div class="attendance-item">
                <div class="att-icon">📝</div>
                <div class="att-details">
                    <div class="att-title">${att.quizTitle}</div>
                    <div class="att-info">
                        <span class="att-date">📅 ${att.date}</span>
                        <span class="att-time">🕐 ${att.time}</span>
                    </div>
                </div>
                <div class="att-result">
                    <div class="att-score">${att.score}%</div>
                    <div class="att-grade grade-${att.grade.toLowerCase()}">${att.grade}</div>
                </div>
            </div>
        `).join('');
        attendanceList.innerHTML = attendanceHTML;
    } else {
        attendanceList.innerHTML = '<p class="no-attendance">No quiz attempts recorded yet</p>';
    }
    
    // Show info card
    infoCard.style.display = 'block';
    noSelection.style.display = 'none';
}
