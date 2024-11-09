// client/menu.js


const menuPanel = document.getElementById('menu-panel');

let profileData = {
    profileImage: './assets/fitGirl.jpg',
    profileName: 'User Name',
    profileBio: 'Bio here',
    userId: null
};

const profileSection = document.createElement('div');
const profileSectionDiv = document.createElement('div');
const profileSectionDivTags = document.createElement('div');

profileSection.classList.add('profile-section');
profileSectionDiv.classList.add('profile-div');
profileSectionDivTags.classList.add('profile-div-tags');

const profileImage = document.createElement('img');
profileImage.src = profileData.profileImage;
profileImage.alt = 'Profile-Image';

const profileName = document.createElement('h1');
profileName.innerHTML = profileData.profileName;

const profileBio = document.createElement('h3');
profileBio.textContent = profileData.profileBio;

const refreshProfile = document.createElement('button');
refreshProfile.textContent = 'Refresh';
refreshProfile.classList.add('refreshProfile');

profileSectionDiv.appendChild(profileImage);
profileSectionDivTags.appendChild(profileName);
profileSectionDivTags.appendChild(profileBio);
profileSectionDiv.appendChild(profileSectionDivTags);

profileSection.appendChild(profileSectionDiv);

menuPanel.appendChild(profileSection);




const loadUserProfile = async () => {
    try {
        const response = await fetch(`/profile/get-profile?time=${Date.now()}`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        if (response.ok && data) {
            profileData.userId = data._id;
            if (!profileData.userId) throw new Error('User ID not found in profile data');

            profileData.profileImage = data.profileImage || '';
            profileData.profileName = data.profileName || 'User Name';
            profileData.profileBio = data.profileBio || 'Bio here';
            // Update UI
            profileImage.src = profileData.profileImage;
            profileName.innerHTML = profileData.profileName;
            profileBio.textContent = profileData.profileBio;
        } else {
            console.log('No profile data found, displaying defaults.');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
};

loadUserProfile();

// Profile modal setup
const buttonProfile = document.createElement('button');
buttonProfile.classList.add('buttonProfile');
buttonProfile.innerText = 'My Profile';
profileSection.append(buttonProfile);
profileSection.appendChild(refreshProfile)
menuPanel.appendChild(profileSection);


refreshProfile.addEventListener('click', () => {
    loadUserProfile();
});

const profileModal = document.getElementById('profile-modal');
const closeModalButton = document.getElementById('close-profile-modal');


buttonProfile.addEventListener('click', () => {
    profileModal.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

// Close modal on outside click
window.addEventListener('click', (event) => {
    if (event.target == profileModal) {
        profileModal.style.display = 'none';
    }
});

document.getElementById('profile-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(document.getElementById('profile-form'));

    try {
        const response = await fetch('/profile/update-profile', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
            alert('Profile updated successfully')
            // Update UI with new profile image, name, and bio if needed
            profileImage.src = result.profileImagePath || profileImage.src;
            profileName.innerHTML = formData.get('profileName') || profileName.innerHTML;
            profileBio.textContent = formData.get('profileBio') || profileBio.textContent;
        } else {
            console.error('Failed to update profile:', result.error);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
});






// Post creation setup
const postModal = document.getElementById('post-modal');
const closePostModal = document.getElementById('close-post-modal');


// Post form submission
document.getElementById('post-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('media', event.target.media.files[0]);
    formData.append('caption', event.target.caption.value);
    formData.append('userId', 'yourUserId');

    try {
        const response = await fetch('/api/create-post', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            alert('Post created successfully!');
        } else {
            alert('Failed to create post');
        }
    } catch (error) {
        console.error('Error submitting post:', error);
    }
});







// client/menu.js

// Friends Section
const friendsSection = document.createElement('div');
friendsSection.classList.add('friendsSection');
const friendsTitle = document.createElement('h2');
friendsTitle.textContent = 'Friends';
friendsSection.appendChild(friendsTitle);
menuPanel.appendChild(friendsSection);


// People to Follow Section
const peopleToFollowSection = document.createElement('div');
peopleToFollowSection.classList.add('peopleToFollowSection');
const peopleTitle = document.createElement('h2');
peopleTitle.textContent = 'People to Follow';
peopleToFollowSection.appendChild(peopleTitle);
menuPanel.appendChild(peopleToFollowSection);



// Fetch and display users in both sections
async function loadFriendsAndPeople() {
    peopleToFollowSection.innerHTML = '<h2>People to Follow</h2>';
    friendsSection.innerHTML = '<h2>Friends</h2>';

    try {
        const response = await fetch('/follow/fetch-people', {
            method: 'GET',
            credentials: 'include'
        });
        const { peopleToFollow, friends } = await response.json();

        peopleToFollow.forEach(person => {
            const personDiv = createPersonDiv(person, 'Follow', handleFollow);
            peopleToFollowSection.appendChild(personDiv);
        });

        friends.forEach(friend => {
            const friendDiv = createPersonDiv(friend, 'Unfollow', handleUnfollow);
            const messageButton = document.createElement('button');
            messageButton.classList.add('messageButton');
            messageButton.textContent = 'Message';
            messageButton.addEventListener('click', () => openChat(friend));
            friendDiv.appendChild(messageButton);
            friendsSection.appendChild(friendDiv);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Create a user/friend card
function createPersonDiv(person, buttonText, buttonHandler) {
    const personDiv = document.createElement('div');
    personDiv.classList.add('personDiv');

    const profileImg = document.createElement('img');
    profileImg.classList.add('profileImage');
    profileImg.src = person.profileImage || './assets/default-avatar.jpg';
    profileImg.alt = `${person.profileName}'s image`;

    const profileName = document.createElement('h3');
    profileName.classList.add('profileName');
    profileName.textContent = person.profileName;

    const actionButton = document.createElement('button');
    actionButton.classList.add('actionButton');
    actionButton.textContent = buttonText;
    actionButton.addEventListener('click', () => buttonHandler(person._id));

    personDiv.appendChild(profileImg);
    personDiv.appendChild(profileName);
    personDiv.appendChild(actionButton);

    return personDiv;
}

// Follow and unfollow handlers
async function handleFollow(userIdToFollow) {
    await fetch('/follow/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userIdToFollow })
    });
    loadFriendsAndPeople(); // Refresh the sections
}

async function handleUnfollow(userIdToUnfollow) {
    await fetch('/follow/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userIdToUnfollow })
    });
    loadFriendsAndPeople(); // Refresh the sections
}

// Create a div container for buttons
const buttonContainer = document.createElement('div');
buttonContainer.classList.add('buttonContainer');

const createPost = document.createElement('button');
createPost.classList.add('createPost');


// Create text for the button
const buttonText = document.createElement('span');
buttonText.innerText = 'Post';
createPost.appendChild(buttonText);

buttonContainer.appendChild(createPost);


createPost.addEventListener('click', () => {
    postModal.style.display = 'block';
});

// Close post modal
closePostModal.addEventListener('click', () => {
    postModal.style.display = 'none';
});



// Initial load and refresh button setup
const refreshButton = document.createElement('button');
refreshButton.textContent = 'Refresh';
refreshButton.classList.add('refreshButton');
refreshButton.addEventListener('click', loadFriendsAndPeople);
buttonContainer.appendChild(refreshButton);

loadFriendsAndPeople();




const logOutButton = document.createElement('button');
logOutButton.classList.add('logOutButton');
logOutButton.innerText = 'Log Out';
logOutButton.addEventListener('click', async () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // Redirect to the home or login page
    window.location.href = '/';
});



buttonContainer.appendChild(logOutButton);
menuPanel.appendChild(buttonContainer);




