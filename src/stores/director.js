import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useDirectorStore = defineStore('director', () => {
  const state = reactive({
    currentDirector: {},
    directors: [],
  });

  const currentDirector = computed(() => state.currentDirector);
  const directors = computed(() => state.directors);

  const getDirectorDetail = async (directorId) => {
    const response = await api.get(`person/${directorId}`, {
      params: { language: 'pt-BR' }
    });
    state.currentDirector = response.data;
  };

  const getA24Directors = async () => {
    try {
      const moviesResponse = await api.get('discover/movie', {
        params: {
          with_companies: 41077,
          language: 'pt-BR',
          sort_by: 'popularity.desc',
        },
      });

      const directorsMap = new Map();

      for (const movie of moviesResponse.data.results.slice(0, 30)) {
        try {
          const creditsResponse = await api.get(`movie/${movie.id}/credits`, {
            params: { language: 'pt-BR' }
          });

          const movieDirectors = creditsResponse.data.crew.filter(
            person => person.job === 'Director'
          );

          for (const director of movieDirectors) {
            if (!directorsMap.has(director.id)) {
              directorsMap.set(director.id, {
                id: director.id,
                name: director.name,
                profile_path: director.profile_path,
                popularity: director.popularity || 0,
                known_for_department: 'Directing',
              });
            }
          }
        } catch (error) {
          console.error(`Erro ao buscar créditos do filme ${movie.id}:`, error);
        }
      }

      const directorsArray = Array.from(directorsMap.values())
        .sort((a, b) => b.popularity - a.popularity);

      state.directors = directorsArray;
    } catch (error) {
      console.error('Erro ao buscar diretores:', error);
    }
  };

  return {
    currentDirector,
    directors,
    getDirectorDetail,
    getA24Directors
  };
});
