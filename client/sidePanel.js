

const sidePanel = document.getElementById('side-panel');

// Create Ads Panel
const adsPanel = document.createElement('div');
adsPanel.classList.add('adsPanel');

// Create Slider Container
const sliderContainer = document.createElement('div');
sliderContainer.classList.add('slider-container');

// Sample ads data
const adsData = [
    {
        title: "Ad Title 1",
        description: "This is the description for ad 1.",
        link: "#",
        image: "./assets/fit2.jpg"
    },
    {
        title: "Ad Title 2",
        description: "This is the description for ad 2.",
        link: "#",
        image: "./assets/fit3.jpg"
    },
    {
        title: "Ad Title 3",
        description: "This is the description for ad 3.",
        link: "#",
        image: "./assets/fit4.jpg"
    },
    {
        title: "Ad Title 4",
        description: "This is the description for ad 4.",
        link: "#",
        image: "./assets/fitGirl.jpg"
    },
    {
        title: "Ad Title 5",
        description: "This is the description for ad 5.",
        link: "#",
        image: "./assets/profile1.jpg"
    },
    {
        title: "Ad Title 6",
        description: "This is the description for ad 6.",
        link: "#",
        image: "./assets/profile2.jpg"
    },
    {
        title: "Ad Title 7",
        description: "This is the description for ad 7.",
        link: "#",
        image: "./assets/profile3.jpg"
    },
    {
        title: "Ad Title 8",
        description: "This is the description for ad 8.",
        link: "#",
        image: "./assets/fit3.jpg"
    },
    {
        title: "Ad Title 9",
        description: "This is the description for ad 9.",
        link: "#",
        image: "./assets/fitGirl.jpg"
    },
    {
        title: "Ad Title 10",
        description: "This is the description for ad 10.",
        link: "#",
        image: "./assets/signup.jpg"
    }
];

// Create each ad element and add it to the slider
adsData.forEach(ad => {
    const adItem = document.createElement('div');
    adItem.classList.add('ad-item');

    const adImage = document.createElement('img');
    adImage.src = ad.image;
    adImage.alt = ad.title;

    const adTitle = document.createElement('h2');
    adTitle.textContent = ad.title;

    const adDescription = document.createElement('p');
    adDescription.textContent = ad.description;

    const adLink = document.createElement('a');
    adLink.href = ad.link;
    adLink.textContent = "Learn More";

    adItem.appendChild(adImage);
    adItem.appendChild(adTitle);
    adItem.appendChild(adDescription);
    adItem.appendChild(adLink);
    sliderContainer.appendChild(adItem);
});

// Append slider to ads panel
adsPanel.appendChild(sliderContainer);
sidePanel.appendChild(adsPanel);

// Auto slide function
let currentIndex = 0;
setInterval(() => {
    currentIndex = (currentIndex + 1) % adsData.length;
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}, 3000); // Change ads every 3 seconds





function getUserIdFromCookie() {
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='));

    if (!cookie) {
        console.log('authToken not found in cookies');
        return null;
    }

    const token = cookie.split('=')[1];
    console.log('Found authToken:', token); // Log token to confirm retrieval

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        console.log('Decoded JWT payload:', payload); // Check the payload content
        if (payload.UserId) {
            console.log("Retrieved User ID:", payload.UserId);
            return payload.UserId;
        } else {
            console.error('User ID not found in decoded payload');
            return null;
        }
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}






// Decode JWT payload to get user data
function decodeJwtPayload(token) {
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return {};
    }
}

// Ensure chat panel and its elements are created in the DOM
function initializeChatPanel() {
    const sidePanel = document.getElementById('side-panel'); // Adjust if the side panel has a different ID

    // Create chat panel container
    const chatPanel = document.createElement('div');
    chatPanel.id = 'chat-panel';
    chatPanel.classList.add('chat-panel');
    chatPanel.style.display = 'none'; // Hidden initially

    // Create chat header for displaying user profile image and name
    const chatHeader = document.createElement('div');
    chatHeader.id = 'chat-header';
    chatHeader.classList.add('chat-header');

    // Add placeholder profile image and name
    const chatProfileImage = document.createElement('img');
    chatProfileImage.classList.add('chat-profile-image');
    chatProfileImage.src = './assets/default-avatar.jpg'; // Default image
    chatHeader.appendChild(chatProfileImage);

    const chatProfileName = document.createElement('h3');
    chatProfileName.classList.add('chat-profile-name');
    chatHeader.appendChild(chatProfileName);

    // Create message display container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'messages-container';
    messagesContainer.classList.add('messages-container');

    // Create message input area
    const messageInputArea = document.createElement('div');
    messageInputArea.classList.add('message-input-area');

    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.id = 'message-input';
    messageInput.placeholder = 'Type a message...';
    messageInputArea.appendChild(messageInput);

    const sendButton = document.createElement('button');
    sendButton.id = 'send-button';
    sendButton.textContent = 'Send';
    messageInputArea.appendChild(sendButton);

    // Append header, messages container, and input area to chat panel
    chatPanel.appendChild(chatHeader);
    chatPanel.appendChild(messagesContainer);
    chatPanel.appendChild(messageInputArea);

    // Append chat panel to side panel
    sidePanel.appendChild(chatPanel);
}

// Call initializeChatPanel when the page loads to ensure chat panel is set up
window.addEventListener('DOMContentLoaded', initializeChatPanel);
function openChat(user) {
    const chatPanel = document.getElementById('chat-panel');
    const chatProfileImage = chatPanel.querySelector('.chat-profile-image');
    const chatProfileName = chatPanel.querySelector('.chat-profile-name');

    if (!chatPanel || !chatProfileImage || !chatProfileName) {
        console.error("Chat panel or required elements are missing");
        return;
    }

    // Set profile image and name in chat header
    chatProfileImage.src = user.profileImage || './assets/default-avatar.jpg';
    chatProfileImage.alt = `${user.profileName}'s profile`;
    chatProfileName.textContent = `Chat with ${user.profileName}`;

    // Set recipient ID for message sending
    chatPanel.dataset.recipientId = user._id;
    console.log('Recipient ID:', user._id); // Log recipient ID

    loadChatHistory(user._id);
    chatPanel.style.display = 'block';
}

async function loadChatHistory(recipientId) {
    try {
        const response = await fetch(`/message/history/${recipientId}`, {
            method: 'GET',
            credentials: 'include'
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const messages = await response.json();
            console.log('Messages received from backend:', messages); // Log messages

            const messagesContainer = document.getElementById('messages-container');
            messagesContainer.innerHTML = ''; // Clear previous messages

            const currentUserId = getUserIdFromCookie(); // Get logged-in user's ID
            console.log("Logged-in User ID from cookie:", currentUserId); // Check the user ID

            messages.forEach(msg => {
                console.log("Message sender ID:", msg.senderId); // Log each message sender's ID

                const isSender = msg.senderId === currentUserId; // Compare IDs
                console.log("Is this message from the sender?", isSender); // Check if correctly identifying sender

                appendMessage({
                    user: isSender ? 'You' : (msg.senderName || 'Unknown'),
                    text: msg.text,
                    self: isSender
                });
            });
        } else {
            console.error('Non-JSON response:', await response.text());
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}


// Event listener for sending a message
document.addEventListener('click', event => {
    if (event.target && event.target.id === 'send-button') {
        sendMessage();
    }
});
async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const text = messageInput.value.trim();
    if (!text) return; // Prevent sending empty messages

    const recipientId = document.getElementById('chat-panel').dataset.recipientId;
    const userId = getUserIdFromCookie();

    if (!userId) {
        console.error("User ID not found; cannot send message.");
        return;
    }

    try {
        const response = await fetch('/message/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, recipientId, text }), // Include userId in the request
            credentials: 'include',
        });

        if (response.ok) {
            messageInput.value = ''; // Clear input field
            loadChatHistory(recipientId); // Refresh chat history
        } else {
            console.error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

function appendMessage(message) {
    console.log('Appending message:', message);

    const messagesContainer = document.getElementById('messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', message.self ? 'sent' : 'received'); // Conditional class
    messageDiv.textContent = `${message.user}: ${message.text}`; // Include the user's name or "You" for self

    messagesContainer.appendChild(messageDiv);
}
