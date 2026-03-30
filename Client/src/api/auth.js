import { API_BASE_URL } from "../config";


export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify(credentials)
  });
if (response.ok) {
 return await response.json()
 }
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Include token if needed
    },
  });
  if (!response.ok) {
    // throw new Error('Logout failed');
    console.log('Log Out Failed')
  }
  return await response.json();
};

export const registerUser = async (userData) => {

  const response = await fetch(`${API_BASE_URL}/student/?id=${encodeURIComponent(userData.id)}`);
  if (!response.ok) {
    console.log('Registration Failed')
  }
  return await response.json();
  
};

// export const check_Auth = async () => {
//   try {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       throw new Error('Unauthorized User!');
//     }
//     return({'success':true})


//   } catch (error) {
 
//     throw error; 
//   }
// };