<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '@/components/SearchBar.vue';

const router = useRouter();
const isMobileMenuOpen = ref(false);
const isHeaderVisible = ref(true);
const lastScrollPosition = ref(0);
const isSearchOpen = ref(false);

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
  }
};

const handleSelectResult = (result) => {
  console.log('Resultado selecionado:', result);

  if (result.type === 'movie') {
    router.push({ name: 'MovieDetails', params: { movieId: result.id } });
  } else if (result.type === 'actor') {
    router.push({ name: 'ActorDetails', params: { actorId: result.id } });
  } else if (result.type === 'director') {
    router.push({ name: 'DirectorDetails', params: { directorId: result.id } });
  }

  isSearchOpen.value = false;
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
  }
  else if (currentScrollPosition < lastScrollPosition.value) {
    isHeaderVisible.value = true;
  }

  lastScrollPosition.value = currentScrollPosition;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
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
        <button class="search-toggle-btn" @click="toggleSearch" type="button">
          <span>🔍</span>
        </button>

        <button
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
          :class="{ active: isMobileMenuOpen }"
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

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

    <SearchBar
      :is-open="isSearchOpen"
      @close="isSearchOpen = false"
      @select-result="handleSelectResult"
    />
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
}
</style>
