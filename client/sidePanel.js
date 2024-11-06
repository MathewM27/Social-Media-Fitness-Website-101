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










// Create Message Panel
const messagePanel = document.createElement('div');
messagePanel.classList.add('messagePanel');

// Create Chat Header
const chatHeader = document.createElement('div');
chatHeader.classList.add('chat-header');
chatHeader.textContent = "Chat with Friends";

// Create Messages Container
const messagesContainer = document.createElement('div');
messagesContainer.classList.add('messages-container');

// Sample static messages
const messagesData = [
    { user: "Alice", text: "Hey! How are you?" },
    { user: "Bob", text: "I'm good, thanks! You?" },
    { user: "Alice", text: "Just working on the project." },
    { user: "Bob", text: "Same here! Let’s catch up later." },
];

// Create message elements
messagesData.forEach(message => {
    const messageItem = document.createElement('div');
    messageItem.classList.add('message-item');
    messageItem.textContent = `${message.user}: ${message.text}`;
    messagesContainer.appendChild(messageItem);
});

// Create Input Container
const inputContainer = document.createElement('div');
inputContainer.classList.add('input-container');

// Create Message Input
const messageInput = document.createElement('input');
messageInput.type = 'text';
messageInput.placeholder = 'Type your message...';

// Create Send Button
const sendButton = document.createElement('button');
sendButton.textContent = "Send";

// Append elements to input container
inputContainer.appendChild(messageInput);
inputContainer.appendChild(sendButton);

// Append all elements to the message panel
messagePanel.appendChild(chatHeader);
messagePanel.appendChild(messagesContainer);
messagePanel.appendChild(inputContainer);

// Append message panel to side panel
sidePanel.appendChild(messagePanel);
