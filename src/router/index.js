import Vue from 'vue';
import VueRouter from 'vue-router';

import Layout from '@/components/layout/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: '门户',
        component: () => import('@/views/portal-list/portal-list.vue'),
        meta: {
          icon: 'el-icon-menu',
        },
      },
    ],
  },
  {
    path: '/portal-list',
    component: Layout,
    children: [
      {
        path: '',
        name: '栏目',
        component: () => import('@/views/page-list/page-list.vue'),
        meta: {
          icon: 'el-icon-s-platform',
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export { routes };
export default router;
