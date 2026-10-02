const profileImageButton = document.getElementById('profile-image-button');
const profileNotice = document.getElementById('profile-notice');
const closeProfileNotice = document.getElementById('close-profile-notice');

profileImageButton.addEventListener('click', function () {
	profileNotice.hidden = false;
});

closeProfileNotice.addEventListener('click', function () {
	profileNotice.hidden = true;
});
