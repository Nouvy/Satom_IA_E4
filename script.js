const API_KEY = 'VOTRE_CLE_API_GEMINI';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                addMessage(aiResponse, 'ai');
            } else {
                throw new Error('Réponse invalide de l\'API');
            }
        } catch (error) {
            console.error('Erreur:', error);
            addMessage('Désolé, une erreur est survenue.', 'ai');
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