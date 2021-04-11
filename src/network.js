import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.VUE_APP_HTTP_HOST,
  headers: {
    Token: '0123456789',
  },
});

/**
 * 门户列表
 * @param {*} data
 * @returns
 */
function menhuList(data) {
  const form = new FormData();
  form.append('formData', JSON.stringify(data));
  return axios.post('/api/portals/list-portals/v1', form);
}

/**
 * 更新门户
 * @param {*} data
 * @returns
 */
function updateMenhu(data) {
  const form = new FormData();
  form.append('formData', JSON.stringify(data));
  return axios.post('/api/portals/update-portals/v1', form);
}

/**
 * 门户详情
 * @param {*} data
 * @returns
 */
function menhuData(data) {
  const form = new FormData();
  form.append('formData', JSON.stringify(data));
  return axios.post('/api/portals/find-portals/v1', form);
}

/**
 * 根据栏目类型获取栏目列表
 * @param {*} data
 * @returns
 */
function getLanmuByType(data) {
  const form = new FormData();
  form.append('formData', JSON.stringify(data));
  return axios.post('/api/pages/list-pages/v1', form);
}

/**
 * 删除门户
 * @param {*} data
 * @returns
 */
function deleteMenhu(data) {
  const form = new FormData();
  form.append('formData', JSON.stringify(data));
  return axios.post('/api/portals/delete-portals/v1', form);
}

/**
 * 新增门户
 * @param {*} data
 * @returns
 */
function createMenhu(data) {
  const form = new FormData();
  form.append('formData', JSON.stringify(data));
  return axios.post('/api/portals/add-portals/v1', form);
}

export { menhuList, updateMenhu, menhuData, getLanmuByType, deleteMenhu, createMenhu };
