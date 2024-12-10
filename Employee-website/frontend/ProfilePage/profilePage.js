// Fetch user profile
async function fetchProfile() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        populateProfileForm(data);
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Update profile
async function updateProfile(profileData) {
    try {
        const response = await fetch('http://localhost:5000/api/auth/update', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        if (response.ok) {
            alert('Profile updated successfully');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

// Initialize profile page
fetchProfile();

// Handle form submission
document.querySelector('.profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        name: this.elements.name.value,
        email: this.elements.email.value,
        phone: this.elements.phone.value,
        availability: this.querySelector('input[name="availability"]:checked').value
    };
    updateProfile(formData);
});