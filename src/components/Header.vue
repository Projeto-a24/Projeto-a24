<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';

const router = useRouter();
const isMobileMenuOpen = ref(false);
const isHeaderVisible = ref(true);
const lastScrollPosition = ref(0);
const searchQuery = ref('');
const isSearchOpen = ref(false);
const searchResults = ref([]);
const isSearching = ref(false);

let searchTimeout = null;

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    isSearchOpen.value = false;
  }
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value) {
    isMobileMenuOpen.value = false;
    setTimeout(() => {
      document.querySelector('.search-input')?.focus();
    }, 100);
  } else {
    searchQuery.value = '';
    searchResults.value = [];
  }
};

const handleSearch = async () => {
  if (searchQuery.value.trim().length < 2) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  try {
    // Buscar filmes, atores e diretores em paralelo
    const [moviesResponse, peopleResponse] = await Promise.all([
      api.get('search/movie', {
        params: {
          query: searchQuery.value,
          language: 'pt-BR',
          include_adult: false,
        },
      }),
      api.get('search/person', {
        params: {
          query: searchQuery.value,
          language: 'pt-BR',
          include_adult: false,
        },
      }),
    ]);

    // Filtrar apenas filmes A24
    const a24Movies = [];
    for (const movie of moviesResponse.data.results.slice(0, 5)) {
      try {
        const detailsResponse = await api.get(`movie/${movie.id}`, {
          params: { language: 'pt-BR' }
        });
        const isA24 = detailsResponse.data.production_companies?.some(
          company => company.id === 41077
        );
        if (isA24) {
          a24Movies.push({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            type: 'movie',
            subtitle: movie.release_date ? new Date(movie.release_date).getFullYear() : '',
          });
        }
      } catch (error) {
        console.error('Erro ao verificar filme:', error);
      }
    }

    // Processar pessoas (atores e diretores)
    const people = peopleResponse.data.results.slice(0, 8).map(person => ({
      id: person.id,
      title: person.name,
      poster_path: person.profile_path,
      type: person.known_for_department === 'Directing' ? 'director' : 'actor',
      subtitle: person.known_for_department === 'Directing' ? 'Diretor' : 'Ator',
    }));

    searchResults.value = [...a24Movies, ...people];
  } catch (error) {
    console.error('Erro ao buscar:', error);
    searchResults.value = [];
  }

  isSearching.value = false;
};

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 500);
};

const selectResult = (result) => {
  if (result.type === 'movie') {
    router.push({ name: 'MovieDetails', params: { movieId: result.id } });
  } else if (result.type === 'actor') {
    router.push({ name: 'ActorDetails', params: { actorId: result.id } });
  } else if (result.type === 'director') {
    router.push({ name: 'DirectorDetails', params: { directorId: result.id } });
  }
  
  isSearchOpen.value = false;
  searchQuery.value = '';
  searchResults.value = [];
};

const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  if (currentScrollPosition < 10) {
    isHeaderVisible.value = true;
    lastScrollPosition.value = currentScrollPosition;
    return;
  }
  
  if (currentScrollPosition > lastScrollPosition.value && currentScrollPosition > 100) {
    isHeaderVisible.value = false;
    isMobileMenuOpen.value = false;
    isSearchOpen.value = false;
  } 
  else if (currentScrollPosition < lastScrollPosition.value) {
    isHeaderVisible.value = true;
  }
  
  lastScrollPosition.value = currentScrollPosition;
};

const closeSearch = (event) => {
  if (!event.target.closest('.search-container')) {
    isSearchOpen.value = false;
    searchQuery.value = '';
    searchResults.value = [];
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', closeSearch);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', closeSearch);
  clearTimeout(searchTimeout);
});
</script>

<template>
  <header class="a24-header" :class="{ 'header-hidden': !isHeaderVisible }">
    <div class="header-container">
      <router-link to="/" class="logo">
        <span class="logo-text">A24</span>
      </router-link>

      <nav class="desktop-nav">
        <router-link to="/" class="nav-link">Filmes</router-link>
        <router-link to="/actors" class="nav-link">Atores</router-link>
        <router-link to="/directors" class="nav-link">Diretores</router-link>
      </nav>

      <div class="header-actions">
        <button class="search-toggle-btn" @click="toggleSearch">
          <span v-if="!isSearchOpen">🔍</span>
          <span v-else>✕</span>
        </button>

        <button 
          class="mobile-menu-btn" 
          @click="toggleMobileMenu"
          :class="{ active: isMobileMenuOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <transition name="slide-down">
      <div v-if="isSearchOpen" class="search-container">
        <div class="search-wrapper">
          <input
            type="text"
            v-model="searchQuery"
            @input="debouncedSearch"
            placeholder="Buscar filmes, atores ou diretores..."
            class="search-input"
          />
          
          <div v-if="isSearching" class="search-loading">
            Buscando...
          </div>

          <div v-if="searchResults.length > 0 && !isSearching" class="search-results">
            <div
              v-for="result in searchResults"
              :key="`${result.type}-${result.id}`"
              class="search-result-item"
              @click="selectResult(result)"
            >
              <div class="result-poster">
                <img
                  v-if="result.poster_path"
                  :src="`https://image.tmdb.org/t/p/w92${result.poster_path}`"
                  :alt="result.title"
                />
                <div v-else class="result-poster-placeholder">
                  {{ result.type === 'movie' ? '🎬' : '👤' }}
                </div>
              </div>
              <div class="result-info">
                <h4>{{ result.title }}</h4>
                <p>{{ result.subtitle }}</p>
              </div>
            </div>
          </div>

          <div v-if="searchQuery.length >= 2 && searchResults.length === 0 && !isSearching" class="no-results">
            Nenhum resultado encontrado
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Nav -->
    <transition name="slide-down">
      <nav v-if="isMobileMenuOpen" class="mobile-nav">
        <router-link to="/" class="mobile-nav-link" @click="isMobileMenuOpen = false">
          Filmes
        </router-link>
        <router-link to="/actors" class="mobile-nav-link" @click="isMobileMenuOpen = false">
          Atores
        </router-link>
        <router-link to="/directors" class="mobile-nav-link" @click="isMobileMenuOpen = false">
          Diretores
        </router-link>
      </nav>
    </transition>
  </header>
</template>

<style scoped>
.a24-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
}

.a24-header.header-hidden {
  transform: translateY(-100%);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.3s ease;
}

.logo:hover .logo-text {
  opacity: 0.7;
}

.desktop-nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #ffffff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-toggle-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.3s ease;
}

.search-toggle-btn:hover {
  opacity: 0.7;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.mobile-menu-btn span {
  width: 20px;
  height: 1.5px;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Search Container */
.search-container {
  background-color: rgba(10, 10, 10, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem 2rem;
}

.search-wrapper {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-loading {
  padding: 1rem;
  text-align: center;
  color: #888888;
  font-size: 0.9rem;
}

.search-results {
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
  background-color: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.search-result-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.result-poster {
  width: 50px;
  height: 75px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-poster-placeholder {
  font-size: 1.5rem;
}

.result-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
}

.result-info h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
}

.result-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #888888;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: #666666;
  font-size: 0.9rem;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  padding: 1.5rem 2rem;
  gap: 1.2rem;
  background-color: rgba(10, 10, 10, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-nav-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: #ffffff;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-nav {
    display: flex;
  }

  .header-container {
    padding: 0.7rem 1.5rem;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  .search-container {
    padding: 1rem 1.5rem;
  }

  .result-poster {
    width: 40px;
    height: 60px;
  }
}
</style>