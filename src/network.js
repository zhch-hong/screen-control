import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.VUE_APP_HTTP_HOST,
});

/**
 * 门户列表
 * @param {*} data
 * @returns
 */
function menhuList(data) {
  return axios.post('/api/portals/list-portals/v1', data);
}

/**
 * 更新门户
 * @param {*} data
 * @returns
 */
function updateMenhu(data) {
  return axios.post('/api/portals/update-portals/v1', data);
}

/**
 * 门户详情
 * @param {*} data
 * @returns
 */
function menhuData(data) {
  return axios.post('/api/portals/find-portals/v1', data);
}

/**
 * 根据栏目类型获取栏目列表
 * @param {*} data
 * @returns
 */
function getLanmuByType(data) {
  return axios.post('/api/pages/list-pages/v1', data);
}

/**
 * 删除门户
 * @param {*} data
 * @returns
 */
function deleteMenhu(data) {
  return axios.post('/api/portals/delete-portals/v1', data);
}

export { menhuList, updateMenhu, menhuData, getLanmuByType, deleteMenhu };
