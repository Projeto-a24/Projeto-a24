<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import SearchBar from '@/components/SearchBar.vue';

const router = useRouter();
const isSearchOpen = ref(false);

const openSearch = () => {
  isSearchOpen.value = true;
};

const closeSearch = () => {
  isSearchOpen.value = false;
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

  closeSearch();
};
</script>

<template>
  <div class="app-wrapper">
    <Header @open-search="openSearch" />

    <main class="main-content">
      <router-view />
    </main>

    <Footer />
    <SearchBar
      :is-open="isSearchOpen"
      @close="closeSearch"
      @select-result="handleSelectResult"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #0a0a0a;
  color: #ffffff;
  overflow-x: hidden;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0a0a0a;
  position: relative;
}

.main-content {
  flex: 1;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #333333;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555555;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #333333 #0a0a0a;
}

.router-view {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

::selection {
  background-color: #ffffff;
  color: #000000;
}

::-moz-selection {
  background-color: #ffffff;
  color: #000000;
}
</style>
