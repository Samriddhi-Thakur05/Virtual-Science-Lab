const experiments = {
    chemistry: {
        title: "Chemistry Lab: Acid-Base Indicator",
        summary: "Use a natural indicator to test acidic and basic samples through visible color changes.",
        apparatus: [
            { name: "Test Tube", icon: "TT" },
            { name: "Indicator", icon: "IN" },
            { name: "Acid Sample", icon: "AC" },
            { name: "Base Sample", icon: "BA" }
        ],
        steps: [
            "Place the test tube and indicator on the virtual table.",
            "Add the acid sample and observe the indicator color.",
            "Add the base sample in a clean tube and compare the result.",
            "Record the observation and connect it with the concept."
        ],
        observations: [
            "The apparatus is ready. Add indicator to begin.",
            "The acidic sample changes the indicator to a pink-red color.",
            "The basic sample changes the indicator to a blue-green color.",
            "Different pH levels create different indicator colors."
        ],
        concept: "Indicators change color because their molecules respond differently in acidic and basic solutions.",
        quiz: {
            question: "What does an indicator help identify?",
            options: ["Whether a solution is acidic or basic", "The weight of a solid", "The length of a wire", "The speed of light"],
            answer: 0
        }
    },
    physics: {
        title: "Physics Lab: Ohm's Law Circuit",
        summary: "Build a simple circuit and observe how voltage, resistance, and current are related.",
        apparatus: [
            { name: "Battery", icon: "V" },
            { name: "Resistor", icon: "R" },
            { name: "Ammeter", icon: "A" },
            { name: "Switch", icon: "S" }
        ],
        steps: [
            "Place the battery, resistor, ammeter, and switch on the table.",
            "Close the switch to complete the circuit.",
            "Increase voltage and watch the current reading rise.",
            "Compare the reading with the formula I = V / R."
        ],
        observations: [
            "The components are arranged in a series circuit.",
            "The circuit becomes active after the switch is closed.",
            "For the same resistance, higher voltage produces higher current.",
            "The result follows Ohm's Law."
        ],
        concept: "Ohm's Law states that current is directly proportional to voltage when resistance remains constant.",
        quiz: {
            question: "If resistance stays the same, what happens when voltage increases?",
            options: ["Current increases", "Current becomes zero", "The resistor disappears", "The circuit becomes biological"],
            answer: 0
        }
    },
    biology: {
        title: "Biology Lab: Plant Cell Observation",
        summary: "Prepare a slide, focus a microscope, and identify key plant cell parts.",
        apparatus: [
            { name: "Glass Slide", icon: "SL" },
            { name: "Leaf Peel", icon: "LP" },
            { name: "Stain", icon: "ST" },
            { name: "Microscope", icon: "MS" }
        ],
        steps: [
            "Place the slide, leaf peel, stain, and microscope on the table.",
            "Add stain to improve visibility.",
            "Focus the microscope carefully.",
            "Identify the cell wall, nucleus, and vacuole."
        ],
        observations: [
            "The plant sample is mounted on the slide.",
            "The stain increases contrast and makes structures easier to see.",
            "Rectangular plant cells are visible under focus.",
            "The cell wall, nucleus, and vacuole can be identified."
        ],
        concept: "Plant cells have a rigid cell wall that supports their shape. Staining helps make internal structures clearer.",
        quiz: {
            question: "Which plant cell structure gives support and shape?",
            options: ["Cell wall", "Ammeter", "Indicator", "Switch"],
            answer: 0
        }
    }
};

const state = {
    current: "chemistry",
    step: 0,
    placed: new Set()
};

const labTitle = document.querySelector("#labTitle");
const labSummary = document.querySelector("#labSummary");
const apparatusList = document.querySelector("#apparatusList");
const dropZone = document.querySelector("#dropZone");
const stepList = document.querySelector("#stepList");
const observationBox = document.querySelector("#observationBox");
const conceptBox = document.querySelector("#conceptBox");
const nextStepBtn = document.querySelector("#nextStepBtn");
const resetLabBtn = document.querySelector("#resetLabBtn");
const quizQuestion = document.querySelector("#quizQuestion");
const quizOptions = document.querySelector("#quizOptions");
const quizResult = document.querySelector("#quizResult");
const canvas = document.querySelector("#experimentCanvas");
const ctx = canvas.getContext("2d");

function scrollToNext(){
    document.getElementById("next").scrollIntoView({ behavior:"smooth" });
}

function loadLab(key){
    const experiment = experiments[key];
    if(!experiment) return;

    state.current = key;
    state.step = 0;
    state.placed = new Set();

    labTitle.textContent = experiment.title;
    labSummary.textContent = experiment.summary;
    observationBox.textContent = "Drag the apparatus into the virtual table, then press Next Step.";
    conceptBox.textContent = experiment.concept;
    dropZone.classList.remove("ready");
    dropZone.innerHTML = "<p>Drop apparatus here</p>";

    document.querySelectorAll("[data-load-lab]").forEach((item) => {
        item.classList.toggle("active", item.dataset.loadLab === key && item.tagName === "BUTTON");
    });

    renderApparatus(experiment);
    renderSteps(experiment);
    renderQuiz(experiment);
    drawSimulation();
}

function renderApparatus(experiment){
    apparatusList.innerHTML = "";

    experiment.apparatus.forEach((item) => {
        const tool = document.createElement("div");
        tool.className = "apparatus-item";
        tool.draggable = true;
        tool.dataset.name = item.name;
        tool.innerHTML = `<span class="apparatus-icon">${item.icon}</span><span>${item.name}</span>`;
        tool.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", item.name);
        });
        tool.addEventListener("click", () => placeApparatus(item.name));
        apparatusList.appendChild(tool);
    });
}

function renderSteps(experiment){
    stepList.innerHTML = "";

    experiment.steps.forEach((text, index) => {
        const item = document.createElement("li");
        item.textContent = text;
        item.className = index === 0 ? "active" : "";
        stepList.appendChild(item);
    });
}

function renderQuiz(experiment){
    quizQuestion.textContent = experiment.quiz.question;
    quizOptions.innerHTML = "";
    quizResult.textContent = "";

    experiment.quiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option;
        button.addEventListener("click", () => checkAnswer(button, index, experiment.quiz.answer));
        quizOptions.appendChild(button);
    });
}

function checkAnswer(button, selected, answer){
    quizOptions.querySelectorAll("button").forEach((option) => {
        option.disabled = true;
    });

    if(selected === answer){
        button.classList.add("correct");
        quizResult.textContent = "Correct. Your observation matches the concept.";
    }else{
        button.classList.add("wrong");
        quizOptions.children[answer].classList.add("correct");
        quizResult.textContent = "Good try. Repeat the experiment steps and check the concept panel.";
    }
}

function nextStep(){
    const experiment = experiments[state.current];
    if(state.step < experiment.steps.length - 1){
        state.step += 1;
    }

    [...stepList.children].forEach((item, index) => {
        item.classList.toggle("done", index < state.step);
        item.classList.toggle("active", index === state.step);
    });

    observationBox.textContent = experiment.observations[state.step];
    drawSimulation();
}

function resetLab(){
    loadLab(state.current);
}

function handleDrop(event){
    event.preventDefault();
    const name = event.dataTransfer.getData("text/plain");
    if(!name) return;

    placeApparatus(name);
}

function placeApparatus(name){
    state.placed.add(name);
    dropZone.classList.add("ready");
    dropZone.innerHTML = [...state.placed]
        .map((item) => `<span class="placed-chip">${item}</span>`)
        .join("");
    observationBox.textContent = `${name} added to the virtual table.`;
    drawSimulation();
}

function drawSimulation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBench();

    if(state.current === "chemistry") drawChemistry();
    if(state.current === "physics") drawPhysics();
    if(state.current === "biology") drawBiology();
}

function drawBench(){
    ctx.fillStyle = "#dcebf3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#b7cedb";
    ctx.fillRect(0, 292, canvas.width, 20);
    ctx.fillStyle = "#6f8798";
    ctx.fillRect(0, 312, canvas.width, 98);
    ctx.fillStyle = "#24445c";
    ctx.font = "bold 18px Poppins";
    ctx.fillText("Virtual Lab Table", 24, 36);
}

function drawChemistry(){
    drawLabel("Acid-Base Indicator Simulation", 235, 60);
    drawTube(260, 105, state.step >= 1 ? "#ff4d6d" : "#80d8ff");
    drawTube(370, 105, state.step >= 2 ? "#35d07f" : "#edf8fc");
    drawBottle(92, 196, "#00D9FF", "Indicator");
    drawBottle(532, 196, state.step >= 2 ? "#35d07f" : "#ff4d6d", state.step >= 2 ? "Base" : "Acid");
}

function drawPhysics(){
    drawLabel("Ohm's Law Circuit Simulation", 246, 60);
    ctx.strokeStyle = "#24445c";
    ctx.lineWidth = 8;
    ctx.beginPath();
    roundedRect(138, 120, 444, 180, 22);
    ctx.stroke();
    drawBattery(96, 178);
    drawResistor(320, 108);
    drawBulb(554, 205, state.step >= 1);
    drawMeter(300, 244, state.step >= 2 ? "0.8 A" : "0.2 A");
}

function drawBiology(){
    drawLabel("Plant Cell Microscope Simulation", 216, 60);
    drawMicroscope(90, 86);
    drawSlide(278, 268);
    drawCells(state.step >= 2);
}

function drawTube(x, y, color){
    ctx.strokeStyle = "#24445c";
    ctx.lineWidth = 6;
    ctx.strokeRect(x, y, 58, 160);
    ctx.fillStyle = color;
    ctx.fillRect(x + 7, y + 86, 44, 67);
    ctx.fillStyle = "rgba(255,255,255,.48)";
    ctx.fillRect(x + 15, y + 16, 10, 90);
}

function drawBottle(x, y, color, label){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 82, 82);
    ctx.fillStyle = "#24445c";
    ctx.fillRect(x + 20, y - 34, 42, 34);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Poppins";
    ctx.fillText(label, x + 10, y + 48);
}

function drawBattery(x, y){
    ctx.fillStyle = "#ffcf5c";
    ctx.fillRect(x, y, 70, 82);
    ctx.fillStyle = "#24445c";
    ctx.font = "bold 32px Poppins";
    ctx.fillText("+", x + 22, y + 52);
}

function drawResistor(x, y){
    ctx.strokeStyle = "#ff4d6d";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x, y + 24);
    for(let i = 0; i < 6; i += 1){
        ctx.lineTo(x + 14 + i * 17, y + (i % 2 ? 8 : 40));
    }
    ctx.lineTo(x + 132, y + 24);
    ctx.stroke();
}

function drawBulb(x, y, active){
    ctx.fillStyle = active ? "#ffe16b" : "#ffffff";
    ctx.strokeStyle = "#24445c";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawMeter(x, y, text){
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#24445c";
    ctx.lineWidth = 4;
    ctx.beginPath();
    roundedRect(x, y, 110, 62, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#24445c";
    ctx.font = "bold 20px Poppins";
    ctx.fillText(text, x + 24, y + 39);
}

function drawMicroscope(x, y){
    ctx.fillStyle = "#24445c";
    ctx.save();
    ctx.translate(x + 132, y + 82);
    ctx.rotate(-0.58);
    ctx.fillRect(-18, -72, 38, 156);
    ctx.restore();
    ctx.fillRect(x + 58, y + 230, 202, 25);
    ctx.fillStyle = "#00D9FF";
    ctx.fillRect(x + 84, y + 104, 98, 38);
}

function drawSlide(x, y){
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#90a7b6";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, 190, 44);
    ctx.fillRect(x + 7, y + 7, 176, 30);
}

function drawCells(focused){
    ctx.strokeStyle = "#35d07f";
    ctx.lineWidth = focused ? 3 : 1;
    for(let row = 0; row < 3; row += 1){
        for(let col = 0; col < 5; col += 1){
            const x = 405 + col * 44;
            const y = 124 + row * 40;
            ctx.strokeRect(x, y, 38, 32);
            if(focused){
                ctx.fillStyle = "#ff4d6d";
                ctx.beginPath();
                ctx.arc(x + 19, y + 16, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawLabel(text, x, y){
    ctx.fillStyle = "#24445c";
    ctx.font = "bold 20px Poppins";
    ctx.fillText(text, x, y);
}

function roundedRect(x, y, width, height, radius){
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
}

function openModal(modal, title){
    if(title){
        document.querySelector("#modalTitle").textContent = title;
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal){
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

function tutorReply(message){
    const lower = message.toLowerCase();
    if(lower.includes("ohm") || lower.includes("circuit")){
        return "Ohm's Law connects voltage, current, and resistance: I = V / R. Try the Physics lab and increase voltage.";
    }
    if(lower.includes("acid") || lower.includes("base") || lower.includes("indicator")){
        return "Indicators change color in acids and bases because their molecular structure changes with pH.";
    }
    if(lower.includes("cell") || lower.includes("plant") || lower.includes("biology")){
        return "Plant cells have a cell wall, nucleus, and vacuole. Use stain to make the structures clearer.";
    }
    if(lower.includes("safe") || lower.includes("safety")){
        return "A virtual lab removes chemical, electrical, and equipment risks while still showing the core concept.";
    }
    return "Start with the observation, then connect it to the concept. Pick a lab above and follow the guided steps.";
}

function addChatMessage(sender, message){
    const chat = document.querySelector("#chatMessages");
    const line = document.createElement("p");
    const label = document.createElement("strong");
    label.textContent = `${sender}:`;
    line.append(label, ` ${message}`);
    chat.appendChild(line);
    chat.scrollTop = chat.scrollHeight;
}

document.querySelectorAll("[data-load-lab]").forEach((item) => {
    item.addEventListener("click", (event) => {
        const lab = item.dataset.loadLab;
        if(lab){
            loadLab(lab);
            document.querySelector("#interactive-lab").scrollIntoView({ behavior:"smooth" });
        }
    });
});

dropZone.addEventListener("dragover", (event) => event.preventDefault());
dropZone.addEventListener("drop", handleDrop);
nextStepBtn.addEventListener("click", nextStep);
resetLabBtn.addEventListener("click", resetLab);

document.querySelector(".menu-toggle").addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        document.querySelector(".nav-links").classList.remove("open");
    });
});

const authModal = document.querySelector("#authModal");
const demoModal = document.querySelector("#demoModal");

document.querySelector(".login-btn").addEventListener("click", () => openModal(authModal, "Login"));
document.querySelector(".signup-btn").addEventListener("click", () => openModal(authModal, "Sign Up"));
document.querySelector(".demo-btn").addEventListener("click", () => openModal(demoModal));

document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if(event.target === modal || event.target.classList.contains("modal-close")){
            closeModal(modal);
        }
    });
});

document.querySelector("#tutorForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#tutorInput");
    const text = input.value.trim();
    if(!text) return;

    addChatMessage("You", text);
    addChatMessage("Tutor", tutorReply(text));
    input.value = "";
});

if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".reveal", {
        opacity:1,
        y:0,
        duration:.85,
        stagger:.08,
        ease:"power2.out",
        scrollTrigger:{
            trigger:"body",
            start:"top 82%"
        }
    });

    gsap.to(".logo", {
        y:-12,
        repeat:-1,
        yoyo:true,
        duration:2,
        ease:"sine.inOut"
    });
}else{
    document.querySelectorAll(".reveal").forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
    });
}

loadLab("chemistry");

/*function apiCall(){
    fetch("http://localhost:8081/hello")
    .then(response => response.text())
    .then(data => {
        document.getElementById("demo").innerHTML = data;
        console.log(data);
    });
}*/
