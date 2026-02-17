/*
   AI Chat JavaScript - Handles messaging and streaming responses
*/

const messagesContainer = document.getElementById('messagesContainer');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const userEmailSpan = document.getElementById('userEmail');

// Display user email from URL
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
if (email) {
    userEmailSpan.textContent = email;
}

// Auto-resize textarea
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
});

// Send on Enter (Shift+Enter for new line)
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Form submit handler
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add message to chat
function addMessage(content, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    msgDiv.innerHTML = `
        <div class="message-avatar">${isUser ? '👤' : '✨'}</div>
        <div class="message-content">${escapeHtml(content)}</div>
    `;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv;
}

// Create streaming AI message
function createStreamingMessage() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';
    msgDiv.innerHTML = `
        <div class="message-avatar">✨</div>
        <div class="message-content streaming"></div>
    `;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv.querySelector('.message-content');
}

// Main send message function
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Disable input
    sendButton.disabled = true;
    messageInput.disabled = true;

    // Create AI response container
    const aiContent = createStreamingMessage();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to get response');
        }

        // Read streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;
            // Parse markdown using marked.js
            aiContent.innerHTML = marked.parse(fullText);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        if (!fullText) {
            aiContent.textContent = 'No response received from AI.';
        }

        aiContent.classList.remove('streaming');

    } catch (error) {
        console.error('Chat error:', error);
        aiContent.textContent = 'Error: ' + error.message;
        aiContent.classList.remove('streaming');
        aiContent.classList.add('error-text');
    }

    // Re-enable input
    sendButton.disabled = false;
    messageInput.disabled = false;
    messageInput.focus();
}
