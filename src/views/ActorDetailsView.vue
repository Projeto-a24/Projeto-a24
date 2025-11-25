<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';

import ActorDetailsHero from '@/components/ActorDetailsHero.vue';
import ActorFilmography from '@/components/ActorFilmography.vue';

const router = useRouter();
const isLoading = ref(false);
const actor = ref({});
const credits = ref([]);

const props = defineProps({
  actorId: {
    type: [Number, String],
    required: true,
  },
});

const goBack = () => {
  router.push({ name: 'Actors' });
};

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } });
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const actorResponse = await api.get(`person/${props.actorId}`, {
      params: { language: 'pt-BR' }
    });
    actor.value = actorResponse.data;

    const creditsResponse = await api.get(`person/${props.actorId}/combined_credits`, {
      params: { language: 'pt-BR' }
    });

    const allCredits = [
      ...creditsResponse.data.cast.map(item => ({
        ...item,
        media_type: item.media_type || 'movie'
      })),
      ...creditsResponse.data.crew.map(item => ({
        ...item,
        media_type: item.media_type || 'movie'
      }))
    ];

    credits.value = allCredits
      .sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01');
        const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01');
        return dateB - dateA;
      })
      .slice(0, 20);

  } catch (error) {
    console.error('Erro ao buscar detalhes do ator:', error);
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="actor-details-page">
    <loading v-model:active="isLoading" is-full-page />

    <ActorDetailsHero
      :actor="actor"
      @go-back="goBack"
    />

    <ActorFilmography
      :credits="credits"
      @open-movie="openMovie"
    />
  </div>
</template>

<style scoped>
.actor-details-page {
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #ffffff;
  padding-top: 3.5rem;
}

@media (max-width: 768px) {
  .actor-details-page {
    padding-top: 3rem;
  }
}
</style>
