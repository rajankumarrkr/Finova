import api from '../lib/api';

/**
 * Uploads user avatar image file to Cloudinary through the Finova backend API.
 * 
 * @param {File} file - The selected image file (JPEG, PNG, WEBP)
 * @param {Function} [onUploadProgress] - Optional Axios progress callback (0 - 100)
 * @returns {Promise<Object>} API response with updated avatar metadata
 */
export const uploadAvatar = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    }
  });

  return response.data;
};

/**
 * Deletes the user's Cloudinary avatar asset and resets to default avatar.
 * 
 * @returns {Promise<Object>} API response with default avatar URL
 */
export const deleteAvatar = async () => {
  const response = await api.delete('/users/avatar');
  return response.data;
};

/**
 * Updates basic profile details like name and phone.
 * 
 * @param {Object} profileData - { name, phone }
 * @returns {Promise<Object>} API response
 */
export const updateProfile = async (profileData) => {
  const response = await api.patch('/users/profile', profileData);
  return response.data;
};

export const userService = {
  uploadAvatar,
  deleteAvatar,
  updateProfile
};

export default userService;
