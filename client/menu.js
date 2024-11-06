// client/menu.js


const menuPanel = document.getElementById('menu-panel');

let profileData = {
    profileImage: './assets/fitGirl.jpg',
    profileName: 'User Name',
    profileBio: 'Bio here',
    userId: null // Initialize userId here
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
            profileData.userId = data._id; // Store the userId from the fetched profile
            if (!profileData.userId) throw new Error('User ID not found in profile data');
            // Set profile data from the response
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

const createPost = document.createElement('button');
createPost.classList.add('createPost');
createPost.innerText = 'Create a Post';
menuPanel.appendChild(createPost);

createPost.addEventListener('click', () => {
    postModal.style.display = 'block';
});

// Close post modal
closePostModal.addEventListener('click', () => {
    postModal.style.display = 'none';
});

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
            // Optionally, call a function to add the post to the feed dynamically
            // displayNewPost(data.post);
        } else {
            alert('Failed to create post');
        }
    } catch (error) {
        console.error('Error submitting post:', error);
    }
});





// // Friends section
// const friendsSection = document.createElement('div');
// friendsSection.classList.add('friendsSection');

// // Sample friend data
// const friendsData = [
//     { name: 'Alice Keen', imgSrc: './assets/fit2.jpg', alt: 'Friend Icon 1' },
//     { name: 'Bella May', imgSrc: './assets/fit3.jpg', alt: 'Friend Icon 2' },
//     { name: 'Jim Karson', imgSrc: './assets/fit4.jpg', alt: 'Friend Icon 3' },
//     { name: 'Stacey Queen', imgSrc: './assets/profile1.jpg', alt: 'Friend Icon 4' },
//     { name: 'Josh Stone', imgSrc: './assets/profile2.jpg', alt: 'Friend Icon 5' },
//     { name: 'Rebecca Jones', imgSrc: './assets/profile3.jpg', alt: 'Friend Icon 6' }
// ];

// friendsData.forEach(friend => {
//     const friendDiv = document.createElement('div');
//     friendDiv.classList.add('friendDiv');

//     const friendsIcon = document.createElement('img');
//     friendsIcon.classList.add('groupIcon');
//     friendsIcon.src = friend.imgSrc;
//     friendsIcon.alt = friend.alt;

//     const friendsName = document.createElement('h2');
//     friendsName.classList.add('groupName');
//     friendsName.innerHTML = friend.name;

//     friendDiv.appendChild(friendsIcon);
//     friendDiv.appendChild(friendsName);
//     friendsSection.appendChild(friendDiv);
// });

// menuPanel.appendChild(friendsSection);

// // Additional buttons
// const settingButton = document.createElement('button');
// settingButton.classList.add('settingButton');
// settingButton.innerText = 'Setting';

// const logOutButton = document.createElement('button');
// logOutButton.classList.add('logOutButton');
// logOutButton.innerText = 'Log Out';
// logOutButton.addEventListener('click', async () => {
//     document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

//     // Redirect to the home or login page
//     window.location.href = '/';
// });

// menuPanel.appendChild(settingButton);
// menuPanel.appendChild(logOutButton);





//FRIENDS

// friends section
const friendsSection = document.createElement('div');
const peopleToFollowSection = document.createElement('div');

// Set initial content for debugging visibility
friendsSection.innerHTML = '<h2>Friends</h2><hr><p>Loading friends...</p>';
friendsSection.style.display = 'block'; // Ensure visible
friendsSection.classList.add('friendsSection');

peopleToFollowSection.innerHTML = '<h2>People to Follow</h2><hr><p>Loading suggestions...</p>';
peopleToFollowSection.style.display = 'block'; // Ensure visible
peopleToFollowSection.classList.add('peopleToFollowSection');

// Append the sections once to the menuPanel
menuPanel.appendChild(friendsSection);
menuPanel.appendChild(peopleToFollowSection);

// Load Friends and People to Follow data from the server
const loadFriendsAndPeople = async () => {
    try {
        // Fetch friends
        const friendsResponse = await fetch('/follow/friends', { credentials: 'include' });
        if (!friendsResponse.ok) {
            throw new Error('Failed to load friends');
        }

        const friends = await friendsResponse.json();
        console.log('Fetched friends:', friends);
        renderFriends(friends);

        // Fetch people to follow
        const peopleResponse = await fetch('/follow/people-to-follow', { credentials: 'include' });
        if (!peopleResponse.ok) {
            throw new Error('Failed to load people to follow');
        }

        const peopleToFollow = await peopleResponse.json();
        console.log('Fetched people to follow:', peopleToFollow);
        renderPeopleToFollow(peopleToFollow);
    } catch (error) {
        console.error('Error loading friends and people to follow:', error);
    }
};

// Render the "Friends" section
const renderFriends = (friends) => {
    friendsSection.innerHTML = '<h2>Friends</h2><hr>'; // Clear and add title
    if (friends.length === 0) {
        friendsSection.innerHTML += '<p>No friends to display.</p>';
    }
    friends.forEach(friend => {
        const friendDiv = document.createElement('div');
        friendDiv.classList.add('friendDiv');

        const friendImage = document.createElement('img');
        friendImage.src = friend.profileImage || './assets/default.jpg';
        friendImage.alt = 'Friend Image';
        friendImage.classList.add('groupIcon');

        const friendName = document.createElement('h2');
        friendName.textContent = friend.profileName;

        const unfollowButton = document.createElement('button');
        unfollowButton.textContent = 'Unfollow';
        unfollowButton.addEventListener('click', () => updateFollowStatus(friend._id, 'unfollow'));

        const chatButton = document.createElement('button');
        chatButton.textContent = 'Chat';
        // Add chat functionality here in the future

        friendDiv.append(friendImage, friendName, unfollowButton, chatButton);
        friendsSection.appendChild(friendDiv);
    });
};

// Render the "People to Follow" section
const renderPeopleToFollow = (peopleToFollow) => {
    peopleToFollowSection.innerHTML = '<h2>People to Follow</h2><hr>'; // Clear and add title
    if (peopleToFollow.length === 0) {
        peopleToFollowSection.innerHTML += '<p>No suggestions at the moment.</p>';
    }
    peopleToFollow.forEach(person => {
        const personDiv = document.createElement('div');
        personDiv.classList.add('friendDiv');

        const personImage = document.createElement('img');
        personImage.src = person.profileImage || './assets/default.jpg';
        personImage.alt = 'Profile Image';
        personImage.classList.add('groupIcon');

        const personName = document.createElement('h2');
        personName.textContent = person.profileName;

        const followButton = document.createElement('button');
        followButton.textContent = 'Follow';
        followButton.addEventListener('click', () => updateFollowStatus(person._id, 'follow'));

        personDiv.append(personImage, personName, followButton);
        peopleToFollowSection.appendChild(personDiv);
    });
};

// Update follow/unfollow status
const updateFollowStatus = async (userId, action) => {
    try {
        const response = await fetch(`/follow/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ friendId: userId })
        });
        if (response.ok) {
            loadFriendsAndPeople(); // Reload friends and people to follow after update
        } else {
            console.error('Failed to update follow status');
        }
    } catch (error) {
        console.error('Error updating follow status:', error);
    }
};

// Refresh button
const refreshButton = document.createElement('button');
refreshButton.classList.add('refresh-list');
refreshButton.textContent = 'Refresh';
refreshButton.addEventListener('click', loadFriendsAndPeople);
menuPanel.appendChild(refreshButton);

// Initial load
loadFriendsAndPeople();
