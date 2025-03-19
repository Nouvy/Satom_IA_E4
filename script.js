const API_URL = 'http://127.0.0.1:4891/v1/chat/completions';

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // Ajuster automatiquement la hauteur du textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });

    // Envoyer le message avec Enter (Shift+Enter pour nouvelle ligne)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Afficher le message de l'utilisateur
        addMessage(message, 'user');
        userInput.value = '';
        userInput.style.height = 'auto';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [{
                        role: "user",
                        content: message
                    }],
                    model: "gpt4all-j",
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0].message) {
                const aiResponse = data.choices[0].message.content;
                addMessage(aiResponse, 'ai');
            } else {
                throw new Error('Réponse invalide de l\'API');
            }
        } catch (error) {
            console.error('Détails de l\'erreur:', {
                message: error.message,
                stack: error.stack
            });
            addMessage(`Erreur: ${error.message}`, 'ai');
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}); 