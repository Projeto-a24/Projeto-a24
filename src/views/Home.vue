<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router';

const router = useRouter();
const genreStore = useGenreStore();

const isLoading = ref(false);
const movies = ref([]);
const featuredMovies = ref([]);
const currentFeaturedIndex = ref(0);

const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');

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
  currentFeaturedIndex.value = (currentFeaturedIndex.value + 1) % featuredMovies.value.length;
};

const prevFeatured = () => {
  currentFeaturedIndex.value = currentFeaturedIndex.value === 0
    ? featuredMovies.value.length - 1
    : currentFeaturedIndex.value - 1;
};

const genreScrollContainer = ref(null);
const scrollGenres = (direction) => {
  if (genreScrollContainer.value) {
    const scrollAmount = 300;
    genreScrollContainer.value.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }
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
  setInterval(() => {
    nextFeatured();
  }, 5000);
});
</script>

<template>
  <div class="a24-home">
    <loading v-model:active="isLoading" is-full-page />

    <section class="hero" v-if="featuredMovies.length > 0">
      <div
        class="hero-background"
        :style="{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url(https://image.tmdb.org/t/p/original${featuredMovies[currentFeaturedIndex].backdrop_path})`
        }"
      >
        <div class="hero-content">
          <div class="hero-text">
            <span class="hero-label">Em Destaque</span>
            <h1 class="hero-title">{{ featuredMovies[currentFeaturedIndex].title }}</h1>
            <p class="hero-overview">{{ featuredMovies[currentFeaturedIndex].overview }}</p>
            <button
              class="hero-btn"
              @click="openMovie(featuredMovies[currentFeaturedIndex].id)"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
        <div class="hero-nav">
          <button @click="prevFeatured" class="hero-nav-btn">‹</button>
          <div class="hero-indicators">
            <span
              v-for="(movie, index) in featuredMovies"
              :key="movie.id"
              :class="['indicator', { active: index === currentFeaturedIndex }]"
              @click="currentFeaturedIndex = index"
            ></span>
          </div>
          <button @click="nextFeatured" class="hero-nav-btn">›</button>
        </div>
      </div>
    </section>

    <section class="brand-section">
      <h2 class="brand-title">A24 FILMS</h2>
      <p class="brand-subtitle">Cinema independente de alta qualidade</p>
    </section>

    <section class="genre-section">
      <div class="section-header">
        <h3>Explorar por Gênero</h3>
        <button
          v-if="genreStore.currentGenreId"
          @click="resetFilter"
          class="reset-btn"
        >
          Limpar Filtro
        </button>
      </div>

      <div class="genre-carousel-wrapper">
        <button @click="scrollGenres('left')" class="carousel-btn left">‹</button>

        <div class="genre-carousel" ref="genreScrollContainer">
          <div
            v-for="genre in genreStore.genres"
            :key="genre.id"
            @click="listMoviesByGenre(genre.id)"
            class="genre-chip"
            :class="{ active: genre.id === genreStore.currentGenreId }"
          >
            {{ genre.name }}
          </div>
        </div>

        <button @click="scrollGenres('right')" class="carousel-btn right">›</button>
      </div>
    </section>

    <section class="movies-section">
      <h3 class="section-title">
        {{ genreStore.currentGenreId ? 'Filmes Filtrados' : 'Catálogo Completo' }}
      </h3>

      <div class="movies-grid">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="movie-card"
          @click="openMovie(movie.id)"
        >
          <div class="movie-poster-wrapper">
            <img
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              :alt="movie.title"
              class="movie-poster"
            />
            <div class="movie-overlay">
              <div class="movie-info">
                <h4>{{ movie.title }}</h4>
                <p class="movie-date">{{ formatDate(movie.release_date) }}</p>
                <div class="movie-rating">
                  ★ {{ movie.vote_average.toFixed(1) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.a24-home {
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #ffffff;
}

.hero {
  position: relative;
  width: 100%;
  height: 85vh;
  overflow: hidden;
}

.hero-background {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: background-image 0.8s ease-in-out;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.hero-content {
  width: 100%;
  padding: 4rem;
  z-index: 2;
}

.hero-text {
  max-width: 600px;
}

.hero-label {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ffffff;
  font-weight: 500;
  display: block;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-overview {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e0e0e0;
  margin-bottom: 2rem;
  max-width: 500px;
}

.hero-btn {
  background-color: #ffffff;
  color: #000000;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-btn:hover {
  background-color: #000000;
  color: #ffffff;
  outline: 2px solid #ffffff;
}

.hero-nav {
  position: absolute;
  bottom: 2rem;
  right: 4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 3;
}

.hero-nav-btn {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.hero-nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000000;
}

.hero-indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: #ffffff;
  width: 24px;
  border-radius: 4px;
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

.genre-section {
  padding: 4rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.section-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.reset-btn {
  background-color: transparent;
  border: 1px solid #ffffff;
  color: #ffffff;
  padding: 0.6rem 1.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.reset-btn:hover {
  background-color: #ffffff;
  color: #000000;
}

.genre-carousel-wrapper {
  position: relative;
  padding: 0 3rem;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.carousel-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000000;
}

.carousel-btn.left {
  left: 0;
}

.carousel-btn.right {
  right: 0;
}

.genre-carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 1rem 0;
}

.genre-carousel::-webkit-scrollbar {
  display: none;
}

.genre-chip {
  flex-shrink: 0;
  padding: 0.8rem 2rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.genre-chip:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
}

.genre-chip.active {
  background-color: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

.movies-section {
  padding: 4rem 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 3rem 2rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2.5rem;
  padding: 0 2rem;
}

.movie-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-8px);
}

.movie-poster-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #1a1a1a;
}

.movie-poster {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.movie-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.movie-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.movie-date {
  font-size: 0.85rem;
  color: #aaa;
  margin: 0 0 0.5rem 0;
}

.movie-rating {
  font-size: 0.9rem;
  color: #ffd700;
  font-weight: 600;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-content {
    padding: 2rem;
  }

  .brand-title {
    font-size: 3rem;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
  }

  .hero-nav {
    right: 2rem;
  }
}
</style>
