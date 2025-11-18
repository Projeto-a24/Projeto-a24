import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/actors',
    name: 'Actors',
    component: () => import('../views/Actor.vue'),
  },
  {
  path: '/movie/:movieId',
  name: 'MovieDetails',
  component: () => import('../views/MovieDetailsView.vue'),
  props: true,
},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
