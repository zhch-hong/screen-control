import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.VUE_APP_HTTP_HOST,
  headers: {
    Token: '0123456789',
  },
});

function formdata(params) {
  const form = new FormData();
  form.append('formData', JSON.stringify(params));
  return form;
}

/**
 * 普通查询字段
 * @param {*} params
 */
function normalFields(params) {
  const data = {
    '~table~': 'lx_sys_dict',
    dict_name: params,
  };
  return axios.post('/api/dictionary/find-dict/v1', formdata(data));
}

/**
 * 高级查询字段
 * @param {*} params
 */
function hightFields(params) {
  const data = {
    '~table~': 'lx_sys_prompt',
    prompt_name: params,
  };
  return axios.post('/api/prompt/business/findPrompt/v1', formdata(data));
}

/**
 * 门户列表
 * @param {*} data
 * @returns
 */
function menhuList(params) {
  return axios.post('/api/portals/list-portals/v1', formdata(params));
}

/**
 * 更新门户
 * @param {*} data
 * @returns
 */
function updateMenhu(params) {
  return axios.post('/api/portals/update-portals/v1', formdata(params));
}

/**
 * 门户详情
 * @param {*} data
 * @returns
 */
function menhuData(params) {
  return axios.post('/api/portals/find-portals/v1', formdata(params));
}

/**
 * 根据栏目类型获取栏目列表
 * @param {*} data
 * @returns
 */
function getLanmuByType(params) {
  return axios.post('/api/pages/list-pages/v1', formdata(params));
}

/**
 * 删除门户
 * @param {*} data
 * @returns
 */
function deleteMenhu(params) {
  return axios.post('/api/portals/delete-portals/v1', formdata(params));
}

/**
 * 新增门户
 * @param {*} data
 * @returns
 */
function createMenhu(params) {
  return axios.post('/api/portals/add-portals/v1', formdata(params));
}

/**
 * 获取栏目列表
 * @param {*} data
 * @returns
 */
function lanmuList(params) {
  return axios.post('/api/pages/list-pages/v1', formdata(params));
}

/**
 * 根据栏目类型获取栏目列表
 * @param {*} data
 * @returns
 */
function lanmuListByType(params) {
  return axios.post('/api/pages/list-pages/v1', formdata(params));
}

/**
 * 新增栏目
 * @param {*} params
 * @returns
 */
function createLanmu(params) {
  return axios.post('/api/pages/add-pages/v1', formdata(params));
}

/**
 * 更新栏目
 * @param {*} params
 * @returns
 */
function updateLanmu(params) {
  return axios.post('/api/pages/update-pages/v1', formdata(params));
}

export default axios;
export { normalFields, hightFields };
export { menhuList, updateMenhu, menhuData, getLanmuByType, deleteMenhu, createMenhu };
export { lanmuList, lanmuListByType, createLanmu, updateLanmu };
