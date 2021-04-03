import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.VUE_APP_HTTP_HOST,
});

function menhuList(data) {
  return axios.post('/api/portals/list-portals/v1', data);
}

function updateMenhu(data) {
  return axios.post('/api/portals/update-portals/v1', data);
}

function menhuData(data) {
  return axios.post('/api/portals/find-portals/v1', data);
}

export { menhuList, updateMenhu, menhuData };
export default axios;
