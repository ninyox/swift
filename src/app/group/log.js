import axios from "axios";
const url = "https://swiftback.onrender.com/api/v1/fetchgroupmsg";
const groupurl = "https://swiftback.onrender.com/api/v1/getgroups";
const fetchurl = "https://swiftback.onrender.com/api/v1/getuser";
const deleteurl = "https://swiftback.onrender.com/api/v1/deletegroup";
const exiturl = "https://swiftback.onrender.com/api/v1/exitgroup";
const token = window.localStorage.getItem("token")

export async function Log(params) {
  try {
    const formData = new URLSearchParams();
    formData.append("params", params);
    const response = axios.post(url, formData.toString(), {
      headers: {
        Authorization: token,
      },
    });
    const result = (await response).data;
    return result.data;
  } catch (error) {
    throw error;
  }
}

export async function Profile() {
  try {
    const response = axios.get(fetchurl, {
      headers: {
        Authorization: token,
      },
    });
    const result = (await response).data;
    return result;
  } catch (error) {
    throw error;
  }
}

export async function Groups(params) {
  try {
    const formData = new URLSearchParams();
    formData.append("params", params);
    const response = axios.post(groupurl, formData.toString(), {
      headers: {
        Authorization: token,
      },
    });
    const result = (await response).data;
    return result;
  } catch (error) {
    throw error;
  }
}

export async function Deletegroup(params) {
  try {
    const formData = new URLSearchParams();
    formData.append("groupid", params);
    const response = axios.post(deleteurl, formData.toString(), {
      headers: {
        Authorization: token,
      },
    });
    const result = (await response).data;
    return result;
  } catch (error) {
    if(error && error?.response.data){
      throw error.response.data
    }
  }
}

export async function Exitgroup(params) {
  try {
    const formData = new URLSearchParams();
    formData.append("groupid", params);
    const response = axios.post(exiturl, formData.toString(), {
      headers: {
        Authorization: token,
      },
    });
    const result = (await response).data;
    return result;
  } catch (error) {
    if(error && error?.response.data){
      throw error.response.data
    }
  }
}