import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useActorStore = defineStore('actor', () => {
  const state = reactive({
    currentActor: {},
    actors: [],
  });

  const currentActor = computed(() => state.currentActor);
  const actors = computed(() => state.actors);

  const getActorDetail = async (actorId) => {
    const response = await api.get(`person/${actorId}`, {
      params: { language: 'pt-BR' }
    });
    state.currentActor = response.data;
  };

  const getPopularActors = async () => {
    const response = await api.get('person/popular', {
      params: {
        language: 'pt-BR',
        page: 1,
      },
    });
    state.actors = response.data.results;
  };

  return { 
    currentActor, 
    actors, 
    getActorDetail, 
    getPopularActors 
  };
});