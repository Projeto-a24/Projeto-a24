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
    path: '/actor/:actorId',
    name: 'ActorDetails',
    component: () => import('../views/ActorDetailsView.vue'),
    props: true,
  },
  {
    path: '/directors',
    name: 'Directors',
    component: () => import('../views/Director.vue'),
  },
  {
    path: '/director/:directorId',
    name: 'DirectorDetails',
    component: () => import('../views/DirectorDetailsView.vue'),
    props: true,
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
