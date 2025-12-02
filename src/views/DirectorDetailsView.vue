<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';

import DirectorDetailsHero from '@/components/DirectorDetailsHero.vue';
import DirectorFilmography from '@/components/DirectorFilmography.vue';

const router = useRouter();
const isLoading = ref(false);
const director = ref({});
const credits = ref([]);

const props = defineProps({
  directorId: {
    type: [Number, String],
    required: true,
  },
});

const goBack = () => {
  router.push({ name: 'Directors' });
};

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } });
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const directorResponse = await api.get(`person/${props.directorId}`, {
      params: { language: 'pt-BR' }
    });
    director.value = directorResponse.data;

    const creditsResponse = await api.get(`person/${props.directorId}/movie_credits`, {
      params: { language: 'pt-BR' }
    });

    const directorCredits = creditsResponse.data.crew
      .filter(item => item.job === 'Director')
      .map(item => ({
        ...item,
        media_type: 'movie'
      }));

    credits.value = directorCredits
      .sort((a, b) => {
        const dateA = new Date(a.release_date || '1900-01-01');
        const dateB = new Date(b.release_date || '1900-01-01');
        return dateB - dateA;
      });

  } catch (error) {
    console.error('Erro ao buscar detalhes do diretor:', error);
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="director-details-page">
    <loading v-model:active="isLoading" is-full-page />

    <DirectorDetailsHero
      :director="director"
      @go-back="goBack"
    />

    <DirectorFilmography
      :credits="credits"
      @open-movie="openMovie"
    />
  </div>
</template>

<style scoped>
.director-details-page {
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #ffffff;
  padding-top: 3.5rem;
}

</style>
