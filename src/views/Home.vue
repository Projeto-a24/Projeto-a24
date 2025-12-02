<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router';

import Hero from '@/components/Hero.vue';
import BrandSection from '@/components/BrandSection.vue';
import GenreCarousel from '@/components/GenreCarousel.vue';
import MoviesGrid from '@/components/MoviesGrid.vue';

const router = useRouter();
const genreStore = useGenreStore();

const isLoading = ref(false);
const movies = ref([]);
const featuredMovies = ref([]);
const currentFeaturedIndex = ref(0);

let featuredIntervalId = null;

const getA24Movies = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_companies: 41077,
        language: 'pt-BR',
        sort_by: 'popularity.desc',
        'vote_count.gte': 100,
      },
    });
    movies.value = response.data.results;
    featuredMovies.value = response.data.results.slice(0, 5);
  } catch (error) {
    console.error('Erro ao buscar filmes da A24:', error);
  }
  isLoading.value = false;
};

const listMoviesByGenre = async (genreId) => {
  genreStore.setCurrentGenreId(genreId);
  isLoading.value = true;
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_companies: 41077,
        with_genres: genreId,
        language: 'pt-BR',
        sort_by: 'popularity.desc',
      },
    });
    movies.value = response.data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes por gênero:', error);
  }
  isLoading.value = false;
};

const nextFeatured = () => {
  if (!featuredMovies.value.length) return;
  currentFeaturedIndex.value =
    (currentFeaturedIndex.value + 1) % featuredMovies.value.length;
};

const prevFeatured = () => {
  if (!featuredMovies.value.length) return;
  currentFeaturedIndex.value =
    currentFeaturedIndex.value === 0
      ? featuredMovies.value.length - 1
      : currentFeaturedIndex.value - 1;
};

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } });
};

const resetFilter = () => {
  genreStore.setCurrentGenreId(null);
  getA24Movies();
};

onMounted(async () => {
  isLoading.value = true;
  await genreStore.getAllGenres('movie');
  await getA24Movies();
  isLoading.value = false;

  featuredIntervalId = setInterval(() => {
    nextFeatured();
  }, 5000);
});

onUnmounted(() => {
  if (featuredIntervalId) {
    clearInterval(featuredIntervalId);
  }
});
</script>

<template>
  <div class="a24-home">
    <loading v-model:active="isLoading" is-full-page />

    <Hero
      :featured-movies="featuredMovies"
      :current-index="currentFeaturedIndex"
      @next="nextFeatured"
      @prev="prevFeatured"
      @select="(index) => (currentFeaturedIndex = index)"
      @open="openMovie"
    />

    <BrandSection />

    <GenreCarousel
      :genres="genreStore.genres"
      :current-genre-id="genreStore.currentGenreId"
      :show-reset="!!genreStore.currentGenreId"
      @select-genre="listMoviesByGenre"
      @reset="resetFilter"
    />

    <MoviesGrid
      :movies="movies"
      :title="genreStore.currentGenreId ? 'Filmes Filtrados' : 'Catálogo Completo'"
      @open-movie="openMovie"
    />
  </div>
</template>

<style scoped>
.a24-home {
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #ffffff;
}
</style>