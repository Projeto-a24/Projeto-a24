<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useRouter } from 'vue-router';

import ActorHero from '@/components/ActorHero.vue';
import ActorsGrid from '@/components/ActorsGrid.vue';

const router = useRouter();
const isLoading = ref(false);
const actors = ref([]);
const featuredActors = ref([]);
const currentFeaturedIndex = ref(0);

let featuredIntervalId = null;

const getA24Actors = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('person/popular', {
      params: {
        language: 'pt-BR',
        page: 1,
      },
    });
    actors.value = response.data.results.slice(0, 20);
    featuredActors.value = response.data.results.slice(0, 6); 
  } catch (error) {
    console.error('Erro ao buscar atores:', error);
  }
  isLoading.value = false;
};

const openActor = (actorId) => {
  router.push({ name: 'ActorDetails', params: { actorId } });
};

const nextFeatured = () => {
  if (!featuredActors.value.length) return;
  currentFeaturedIndex.value =
    (currentFeaturedIndex.value + 2) % featuredActors.value.length;
};

const prevFeatured = () => {
  if (!featuredActors.value.length) return;
  currentFeaturedIndex.value =
    currentFeaturedIndex.value - 2 < 0
      ? featuredActors.value.length - 2
      : currentFeaturedIndex.value - 2;
};

onMounted(async () => {
  await getA24Actors();

  featuredIntervalId = setInterval(() => {
    nextFeatured();
  }, 6000);
});

onUnmounted(() => {
  if (featuredIntervalId) {
    clearInterval(featuredIntervalId);
  }
});
</script>

<template>
  <div class="actors-page">
    <loading v-model:active="isLoading" is-full-page />

    <ActorHero
      :featured-actors="featuredActors"
      :current-index="currentFeaturedIndex"
      @next="nextFeatured"
      @prev="prevFeatured"
      @select="(index) => (currentFeaturedIndex = index)"
      @open="openActor"
    />

    <section class="brand-section">
      <h2 class="brand-title">ELENCO A24</h2>
      <p class="brand-subtitle">Conheça os talentos por trás das grandes produções</p>
    </section>

    <ActorsGrid
      :actors="actors"
      title="Todos os Atores"
      @open-actor="openActor"
    />
  </div>
</template>

<style scoped>
.actors-page {
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


</style>
