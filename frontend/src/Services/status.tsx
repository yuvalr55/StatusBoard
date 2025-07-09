import {API_URL_SERVER, Axios} from './index'

const PATH = 'status';

export async function updateStatus(status: string) {
  try {
    const response = await Axios.post(`${API_URL_SERVER}/${PATH}`, { status }, { withCredentials: true });
    if (response.status === 200) {
      // localStorage.setItem("status", status);
    }
    return response.data;
  } catch (error) {
    console.error("Failed to update status:", error);
    // throw error;
  }
}

export async function fetchStatuses(filter?: string[]) {
  try {
    const queryParam = filter && filter.length
      ? '?' + filter.map(f => `filter=${encodeURIComponent(f)}`).join('&')
      : '';
    const response = await Axios.get(`${API_URL_SERVER}/${PATH}${queryParam}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch statuses:", error);
    throw error;
  }
}

export async function fetchMyStatus() {
  try {
    const response = await Axios.get(`${API_URL_SERVER}/${PATH}/me`, { withCredentials: true });
    // Return full user data, not only status
    return response.data;
  } catch (error) {
    console.error("Failed to fetch my status:", error);
    throw error;
  }
}
