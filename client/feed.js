
const feedPanel = document.getElementById('feed-panel');

// Create a new search panel div
const searchPanel = document.createElement('div');
searchPanel.classList.add('search-panel');

// Create a search container div
const searchContainer = document.createElement('div');
searchContainer.classList.add('search-container');

// Create a search input element
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search for posts, friends, or groups...';
searchInput.classList.add('search-input');

// Create a search icon using Font Awesome
const searchIcon = document.createElement('i');
searchIcon.classList.add('fas', 'fa-search');

// Add the icon and input to the search container
searchContainer.appendChild(searchIcon);
searchContainer.appendChild(searchInput);

// Add the search container to the search panel
searchPanel.appendChild(searchContainer);

// Append the search panel to the feed panel
feedPanel.appendChild(searchPanel);

// Sample user data (simulating statuses with images)
const statuses = [
    {
        name: "Your Status",
        image: "./assets/fitGirl.jpg",
        isOwn: true
    },
    {
        name: "John Doe",
        image: "./assets/fit2.jpg",
    },
    {
        name: "Jane Smith",
        image: "./assets/fit3.jpg",
    },
    {
        name: "Jane Smith",
        image: "./assets/profile3.jpg",
    },
    {
        name: "Jane Smith",
        image: "./assets/profile1.jpg",
    },
    {
        name: "Jane Smith",
        image: "./assets/fitGirl.jpg",
    },
];

// Create a new status section
const storiesHeading = document.createElement('h1');
storiesHeading.textContent = 'Stories';
storiesHeading.classList.add('stories-heading');

const statusSection = document.createElement('div');
statusSection.classList.add('status-section');

// Create a modal for displaying status when clicked
const statusModal = document.createElement('div');
statusModal.classList.add('status-modal');
statusModal.style.display = 'none'; // Initially hidden

const statusImage = document.createElement('img');
statusImage.classList.add('status-image');
statusModal.appendChild(statusImage);

// Add modal to body
document.body.appendChild(statusModal);


// Loop through statuses and create individual status items
statuses.forEach((status) => {
    const statusItem = document.createElement('div');
    statusItem.classList.add('status-item');

    // If it's the user's own status, add a plus icon
    if (status.isOwn) {
        const addIcon = document.createElement('i');
        addIcon.classList.add('fas', 'fa-plus');
        statusItem.appendChild(addIcon);
    }

    // Add the status image
    const statusImg = document.createElement('img');
    statusImg.src = status.image;
    statusImg.alt = `${status.name}'s status`;
    statusItem.appendChild(statusImg);

    // Add click event to open modal
    statusItem.addEventListener('click', () => {
        if (!status.isOwn) {
            // Show the modal with the clicked status image
            statusImage.src = status.image;
            statusModal.style.display = 'block';
        } else {
            // Logic for adding own status (can add form for image upload later)
            alert('Add your own status');
        }
    });

    // Append each status item to the status section
    statusSection.appendChild(statusItem);
});

// Close modal on click
statusModal.addEventListener('click', () => {
    statusModal.style.display = 'none';
});

feedPanel.appendChild(storiesHeading);
feedPanel.appendChild(statusSection);






// Create a refresh button
const refreshingButton = document.createElement('button');

// refreshButton.classList.add('refresh-button');

const refreshingIcon = document.createElement('i');
refreshingIcon.classList.add('fas', 'fa-sync'); // Font Awesome refresh icon

// Append the icon to the button
refreshingButton.appendChild(refreshingIcon);
// Add event listener to the refresh button

// Append the refresh button to the feed panel
feedPanel.appendChild(refreshingButton);






// Create a new post section
const postSection = document.createElement('div');
postSection.classList.add('post-section');

// Append the post section to the feed panel
feedPanel.appendChild(postSection);

// Function to fetch posts
async function fetchPosts() {
    try {
        const response = await fetch('/api/fetch-posts', {
            method: 'GET',
            credentials: 'include'

        });

        const posts = await response.json();
        console.log(posts)


        postSection.innerHTML = '';

        // If no posts fetched, show default posts
        if (posts.length === 0) {
            console.log("No posts available.");
        } else {
            // Reverse the posts array to display the latest posts first
            posts.reverse();

            // Loop through fetched posts and create individual post items
            posts.forEach(post => {
                // // Use profileData for username and avatar if available
                // post.username = profileData.profileName || 'User Name';
                // post.avatar = profileData.profileImage || './assets/default-avatar.jpg';

                // Ensure post has a timePosted property
                post.timePosted = formatTime(post.createdAt);

                appendPost(post);
            });
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}


// Function to format the time
function formatTime(time) {
    const date = new Date(time);
    return date.toLocaleString();
}





// Function to append a post to the post section
function appendPost(post) {
    const postItem = document.createElement('div');
    postItem.classList.add('post-item');

    // Post header
    const postHeader = document.createElement('div');
    postHeader.classList.add('post-header');

    const avatar = document.createElement('img');
    avatar.src = post.avatar; // Use the avatar fetched from profile
    avatar.alt = `${post.username}'s avatar`;
    avatar.classList.add('avatar');

    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');

    const username = document.createElement('span');
    username.classList.add('username');
    username.textContent = post.username;

    const timePosted = document.createElement('span');
    timePosted.classList.add('time-posted');
    timePosted.textContent = post.timePosted; // Display the formatted time

    userInfo.appendChild(username);
    userInfo.appendChild(timePosted);
    postHeader.appendChild(avatar);
    postHeader.appendChild(userInfo);

    // Post caption
    const postCaption = document.createElement('p');
    postCaption.classList.add('post-caption');
    postCaption.textContent = post.caption;

    // Post media (image)
    const postMedia = document.createElement('img');
    postMedia.src = post.media || './assets/default-post-image.jpg'; // Use a default post image if none is provided
    postMedia.alt = `${post.username}'s post image`;
    postMedia.classList.add('post-media');

    // Post actions (like, dislike, comment)
    const postActions = document.createElement('div');
    postActions.classList.add('post-actions');

    const likeButton = document.createElement('button');
    likeButton.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';
    likeButton.classList.add('like')
    const likeCount = document.createElement('span');
    likeCount.className = 'like-count';
    likeCount.innerText = post.likes ? post.likes.length : 0; // Initial like count

    likeButton.addEventListener('click', () => handleLike(post._id, likeCount));

    const dislikeButton = document.createElement('button');
    dislikeButton.innerHTML = '<i class="fas fa-thumbs-down"></i> Dislike';
    dislikeButton.classList.add('dislike-button'); // Initial class for styling
    const dislikeCount = document.createElement('span');
    dislikeCount.className = 'dislike-count';
    dislikeCount.innerText = post.dislikes ? post.dislikes.length : 0; // Initial dislike count

    dislikeButton.addEventListener('click', () => handleDislike(post._id, dislikeCount, dislikeButton));

    const commentButton = document.createElement('button');
    commentButton.innerHTML = '<i class="fas fa-comment"></i> Comment';

    postActions.appendChild(likeButton);
    postActions.appendChild(likeCount);
    postActions.appendChild(dislikeButton);
    postActions.appendChild(dislikeCount);
    postActions.appendChild(commentButton);

    // Append all elements to the post item
    postItem.appendChild(postHeader);
    postItem.appendChild(postCaption);
    postItem.appendChild(postMedia);
    postItem.appendChild(postActions);

    // Append each post item to the post section
    postSection.appendChild(postItem);

    // Append this in the `appendPost` function after post actions

    // Comment section container
    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');

    // Comment input field
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Add a comment...';
    commentInput.classList.add('comment-input');

    // Comment submit button
    const commentSubmit = document.createElement('button');
    commentSubmit.innerHTML = 'Post';
    commentSubmit.classList.add('comment-submit');

    // Append input and button to the comment section
    commentSection.appendChild(commentInput);
    commentSection.appendChild(commentSubmit);

    // Container to display comments
    const commentList = document.createElement('div');
    commentList.classList.add('comment-list');

    // Populate initial comments if available
    // Populate initial comments if available
    if (post.comments) {
        post.comments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.classList.add('comment-item');
            commentItem.textContent = `${comment.username}: ${comment.text}`;
            commentList.appendChild(commentItem);
        });
    }


    // Add the comment section and list to the post item
    postItem.appendChild(commentSection);
    postItem.appendChild(commentList);

    // Event listener for posting a comment
    commentSubmit.addEventListener('click', async () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            await handleComment(post._id, commentText, commentList);
            commentInput.value = ''; // Clear input after posting
        }
    });
}







async function handleLike(postId, likeCountElement) {
    try {
        const response = await fetch('/like/like-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ postId }) // Send the postId here
        });

        if (response.ok) {
            console.log('Post liked successfully');
            // Update like count in the UI
            const newLikeCount = parseInt(likeCountElement.innerText) + 1;
            likeCountElement.innerText = newLikeCount; // Update displayed count
            likeButton.classList.add('liked');


        } else {
            console.error('Failed to like post');
        }
    } catch (error) {
        console.error('Error liking post:', error);
    }
}



async function handleDislike(postId, dislikeCountElement, dislikeButton) {
    try {
        const response = await fetch('/dislike/disLike-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ postId }) // Send the postId here
        });

        if (response.ok) {
            console.log('Post disliked successfully');
            // Update dislike count in the UI
            const newDislikeCount = parseInt(dislikeCountElement.innerText) + 1;
            dislikeCountElement.innerText = newDislikeCount; // Update displayed count

            // Toggle the 'disliked' class to change color
            dislikeButton.classList.add('disliked'); // Adds the red color to the button/icon
        } else {
            console.error('Failed to dislike post');
        }
    } catch (error) {
        console.error('Error disliking post:', error);
    }
}
async function handleComment(postId, text, commentList) {
    try {
        const response = await fetch('/comments/add-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ postId, text })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Comment added successfully');
            const commentItem = document.createElement('div');
            commentItem.classList.add('comment-item');
            commentItem.textContent = `${data.username}: ${text}`; // Display the username
            commentList.appendChild(commentItem);
        } else {
            console.error('Failed to add comment');
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}


refreshingButton.addEventListener('click', fetchPosts);