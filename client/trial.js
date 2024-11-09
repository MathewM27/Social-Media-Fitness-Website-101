
// // Create Message Panel
// const messagePanel = document.createElement('div');
// messagePanel.classList.add('messagePanel');

// // Create Chat Header
// const chatHeader = document.createElement('div');
// chatHeader.classList.add('chat-header');
// chatHeader.textContent = "Chat with Friends";

// // Create Messages Container
// const messagesContainer = document.createElement('div');
// messagesContainer.classList.add('messages-container');

// // Sample static messages
// const messagesData = [
//     { user: "Alice", text: "Hey! How are you?" },
//     { user: "Bob", text: "I'm good, thanks! You?" },
//     { user: "Alice", text: "Just working on the project." },
//     { user: "Bob", text: "Same here! Let’s catch up later." },
// ];

// // Create message elements
// messagesData.forEach(message => {
//     const messageItem = document.createElement('div');
//     messageItem.classList.add('message-item');
//     messageItem.textContent = `${message.user}: ${message.text}`;
//     messagesContainer.appendChild(messageItem);
// });

// // Create Input Container
// const inputContainer = document.createElement('div');
// inputContainer.classList.add('input-container');

// // Create Message Input
// const messageInput = document.createElement('input');
// messageInput.type = 'text';
// messageInput.placeholder = 'Type your message...';

// // Create Send Button
// const sendButton = document.createElement('button');
// sendButton.textContent = "Send";

// // Append elements to input container
// inputContainer.appendChild(messageInput);
// inputContainer.appendChild(sendButton);

// // Append all elements to the message panel
// messagePanel.appendChild(chatHeader);
// messagePanel.appendChild(messagesContainer);
// messagePanel.appendChild(inputContainer);

// // Append message panel to side panel
// sidePanel.appendChild(messagePanel);

