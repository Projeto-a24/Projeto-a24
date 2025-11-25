<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useRouter } from 'vue-router';

import DirectorHero from '@/components/DirectorHero.vue';
import DirectorsGrid from '@/components/DirectorsGrid.vue';

const router = useRouter();
const isLoading = ref(false);
const directors = ref([]);
const featuredDirectors = ref([]);
const currentFeaturedIndex = ref(0);

let featuredIntervalId = null;

const getA24Directors = async () => {
  isLoading.value = true;
  try {
    // Buscar filmes A24
    const moviesResponse = await api.get('discover/movie', {
      params: {
        with_companies: 41077,
        language: 'pt-BR',
        sort_by: 'popularity.desc',
      },
    });

    // Extrair diretores únicos dos filmes
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

    directors.value = directorsArray;
    featuredDirectors.value = directorsArray.slice(0, 5);
  } catch (error) {
    console.error('Erro ao buscar diretores:', error);
  }
  isLoading.value = false;
};

const openDirector = (directorId) => {
  router.push({ name: 'DirectorDetails', params: { directorId } });
};

const nextFeatured = () => {
  if (!featuredDirectors.value.length) return;
  currentFeaturedIndex.value =
    (currentFeaturedIndex.value + 1) % featuredDirectors.value.length;
};

const prevFeatured = () => {
  if (!featuredDirectors.value.length) return;
  currentFeaturedIndex.value =
    currentFeaturedIndex.value === 0
      ? featuredDirectors.value.length - 1
      : currentFeaturedIndex.value - 1;
};

onMounted(async () => {
  await getA24Directors();

  // Auto-advance carousel
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
  <div class="directors-page">
    <loading v-model:active="isLoading" is-full-page />

    <!-- Hero de diretores em destaque -->
    <DirectorHero
      :featured-directors="featuredDirectors"
      :current-index="currentFeaturedIndex"
      @next="nextFeatured"
      @prev="prevFeatured"
      @select="(index) => (currentFeaturedIndex = index)"
      @open="openDirector"
    />

    <!-- Seção da marca -->
    <section class="brand-section">
      <h2 class="brand-title">DIRETORES A24</h2>
      <p class="brand-subtitle">Visionários por trás das produções aclamadas</p>
    </section>

    <!-- Grid de diretores -->
    <DirectorsGrid
      :directors="directors"
      title="Todos os Diretores"
      @open-director="openDirector"
    />
  </div>
</template>

<style scoped>
.directors-page {
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #ffffff;
}

.brand-section {
  text-align: center;
  padding: 6rem 2rem 4rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-title {
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.brand-subtitle {
  font-size: 1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #888;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .brand-title {
    font-size: 3rem;
  }
}
</style>
