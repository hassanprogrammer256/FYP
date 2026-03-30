import axios from "axios";
import { API_BASE_URL } from "../config";

 export const fetch_user_data = async () => {
      try {
        const reg_no = localStorage.getItem('reg_no')
        const role = localStorage.getItem('role')
        if (role === 'student') {
        const response = await axios.get(`${API_BASE_URL}accounts/student/${reg_no}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
              if (!response.status === 200) {
           throw new Error(`Failed to fetch student data`);
       
        }
        else{
return response.data
        }
      }
        else if (role === 'supervisor') {
          const response = await axios.get(`${API_BASE_URL}accounts/supervisor/${reg_no}`, {
            method: 'GET',headers: { 'Content-Type': 'application/json' },
          });
        if (!response.status === 200) {
           throw new Error(`Failed to fetch student data`);
       
        }
        else{
return response.data
        }

        }else{
          throw new Error('Invalid user role');
        }


      } catch (error) {
        throw new Error(`Failed to fetch student data: ${error}`);;
      } 
    };

  export const UpdateProfileApi = async(data) => {
    const reg_no = localStorage.getItem('reg_no')
    const response = await axios.put(`${API_BASE_URL}student/update-details/`,{reg_no,data})
    if (response.status === 200){
      return response.data
    }
  }


