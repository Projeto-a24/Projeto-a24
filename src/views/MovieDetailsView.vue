<script setup>
import { defineProps, onMounted, computed, ref } from 'vue';
import { useMovieStore } from '@/stores/movie';
import { useRouter } from 'vue-router';
import Loading from 'vue-loading-overlay';
import api from '@/plugins/axios';

import MovieDetailsHero from '@/components/MovieDetailsHero.vue';
import MovieCastSection from '@/components/MovieCastSection.vue';
import MovieCompaniesSection from '@/components/MovieCompaniesSection.vue';

const movieStore = useMovieStore();
const router = useRouter();
const isLoading = ref(false);
const cast = ref([]);
const trailer = ref(null);

const props = defineProps({
  movieId: {
    type: [Number, String],
    required: true,
  },
});

const movie = computed(() => movieStore.currentMovie);

const goBack = () => {
  router.push({ name: 'Home' });
};

const openActor = (actorId) => {
  router.push({ name: 'ActorDetails', params: { actorId } });
};

const openTrailer = () => {
  if (trailer.value) {
    window.open(`https://www.youtube.com/watch?v=${trailer.value.key}`, '_blank');
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await movieStore.getMovieDetail(Number(props.movieId));

    const creditsResponse = await api.get(`movie/${props.movieId}/credits`, {
      params: { language: 'pt-BR' }
    });
    cast.value = creditsResponse.data.cast.slice(0, 12);

    const videosResponse = await api.get(`movie/${props.movieId}/videos`, {
      params: { language: 'pt-BR' }
    });
    const trailers = videosResponse.data.results.filter(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    if (trailers.length > 0) {
      trailer.value = trailers[0];
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="movie-details-page">
    <loading v-model:active="isLoading" is-full-page />

    <MovieDetailsHero
      :movie="movie"
      :trailer="trailer"
      @go-back="goBack"
      @open-trailer="openTrailer"
    />

    <MovieCastSection
      :cast="cast"
      @open-actor="openActor"
    />

    <MovieCompaniesSection
      :companies="movie.production_companies || []"
    />
  </div>
</template>

<style scoped>
.movie-details-page {
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #ffffff;
  padding-top: 3.5rem;
}

@media (max-width: 768px) {
  .movie-details-page {
    padding-top: 3rem;
  }
}
</style>
