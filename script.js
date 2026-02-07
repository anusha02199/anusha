function updateTime() {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    const now = new Date();

    // Time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (clockElement) clockElement.textContent = `${hours}:${minutes}`;

    // Date
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    if (dateElement) dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Initial call and interval
updateTime();
setInterval(updateTime, 1000);

// Add simple hover interactions or animations if needed using JS
const cards = document.querySelectorAll('.glass-panel');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

/* --- CHATBOT LOGIC --- */

const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

// Resume Context
const resumeContext = `
You are an AI assistant for Korada Anusha. You are here to answer questions about her resume and experience.
Be professional, concise, and helpful.

Here is Anusha's resume data:
Name: KORADA ANUSHA
Location: Berhampur, Ganjam Dist
Email: anushakorada12@gmail.com
Mobile: 8895662988

Career Objective: To get the job as a junior programmer in a well reputed company and gain as much as knowledge and applied when comforted by difficulties.

Education:
1. MCA from NIST (BPUT) - 2019 - 8.63 CGPA
2. BCA from RICMS (Berhampur University) - 2017 - 79%
3. XII from SBR Women’s College (CHSE) - 2014 - 48%
4. X from MVN (SSC) - 2011 - 81%

Technical Skills:
- Programming: Java
- Web: HTML, CSS
- RDBMS: Oracle
- OS: Window

Projects:
- Title: Online Test
- Technologies: Java, HTML
- Duration: 3 Months
- Description: A system giving facility to test the knowledge of the student.

Areas of Interest: Java, Theory Of Computation, HTML
Hobbies: Listening to melody music, Drawing
Traits: Quick Learning Ability, Optimistic Nature
`;

// Groq API Config
const GROQ_API_KEY = "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"; // WARN: Exposed Client Side
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

let chatHistory = [
    { role: "system", content: resumeContext }
];

// Toggle Chat
chatToggle.addEventListener('click', () => {
    chatWindow.classList.add('open');
    chatToggle.style.transform = 'scale(0)';
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    setTimeout(() => {
        chatToggle.style.transform = 'scale(1)';
    }, 300);
});

// Send Message
async function sendMessage() {
    const userText = chatInput.value.trim();
    if (!userText) return;

    // Add User Message to UI
    appendMessage(userText, 'user-message');
    chatInput.value = '';

    // Add User Message to History
    chatHistory.push({ role: "user", content: userText });

    // Loading State
    const loadingId = appendMessage("Typing...", 'bot-message');

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: chatHistory,
                temperature: 0.7
            })
        });

        const data = await response.json();

        // Remove loading message
        const loadingMsg = document.getElementById(loadingId);
        if (loadingMsg) loadingMsg.remove();

        if (data.choices && data.choices.length > 0) {
            const botText = data.choices[0].message.content;
            appendMessage(botText, 'bot-message');
            chatHistory.push({ role: "assistant", content: botText });
        } else {
            appendMessage("Sorry, I encountered an error.", 'bot-message');
        }

    } catch (error) {
        console.error("Chat Error:", error);
        // Remove loading message
        const loadingMsg = document.getElementById(loadingId);
        if (loadingMsg) loadingMsg.remove();
        appendMessage("Sorry, connection failed.", 'bot-message');
    }
}

function appendMessage(text, className) {
    const msgDiv = document.createElement('div');
    const msgId = 'msg-' + Date.now();
    msgDiv.id = msgId;
    msgDiv.classList.add('message', className);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgId;
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
