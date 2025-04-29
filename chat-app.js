// chat-app.js
const chatHistory = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatContainer = document.getElementById('chat-container');
const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

function showLoginForm() {
    loginForm.classList.remove('hidden');
    chatContainer.classList.add('hidden');
}

function showChatContainer() {
    loginForm.classList.add('hidden');
    chatContainer.classList.remove('hidden');
}

function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.innerHTML = `<p class="text-sm ${sender === 'user' ? 'text-right' : 'text-left'} text-gray-300"></p><p>${message}</p>`;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText) return;

    addMessage(messageText, 'user');
    messageInput.value = '';

    try {
        const response = await fetch('https://n8n-pgfu.onrender.com:443/webhook-test/d2fb4135-3ea4-43fd-96b1-bc8fc2e9b0c8', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageText })
        });

        const result = await response.json();
        const botResponse = result.reply || 'No response from bot.';
        addMessage(botResponse, 'bot');
    } catch (error) {
        console.error('Error sending message:', error);
        addMessage('Error communicating with server.', 'bot');
    }
}

async function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        const response = await fetch('users.json');
        const users = await response.json();

        const userMatch = users.find(user => user.username === username && user.password === password);

        if (userMatch) {
            showChatContainer();
        } else {
            errorMessage.textContent = 'Invalid username or password.';
            errorMessage.classList.remove('hidden');
            setTimeout(() => errorMessage.classList.add('hidden'), 3000);
        }
    } catch (error) {
        errorMessage.textContent = 'Could not load user data.';
        errorMessage.classList.remove('hidden');
    }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') sendMessage();
});
loginButton.addEventListener('click', handleLogin);

window.addEventListener('load', () => {
    showLoginForm();
});
