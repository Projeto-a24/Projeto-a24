<script setup>
import { ref, watch } from 'vue';
import api from '@/plugins/axios';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'select-result']);

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const noResultsFound = ref(false);

const performSearch = async () => {
 const query = searchQuery.value.trim();

 noResultsFound.value = false;

 if (query.length < 2) {
  searchResults.value = [];
  return;
 }

 isSearching.value = true;
 searchResults.value = [];

 try {
  const moviesRes = await api.get('search/movie', {
   params: {
    query: query,
    language: 'pt-BR',
    page: 1,
   },
  });

  const peopleRes = await api.get('search/person', {
   params: {
    query: query,
    language: 'pt-BR',
    page: 1,
   },
  });

  const movies = [];
  for (const movie of moviesRes.data.results.slice(0, 5)) {
   try {
    const details = await api.get(`movie/${movie.id}`);
    const isA24 = details.data.production_companies?.some(c => c.id === 41077);

    if (isA24) {
     movies.push({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      type: 'movie',
      year: movie.release_date ? movie.release_date.split('-')[0] : '',
     });
    }
   } catch (err) {
    console.error('Erro ao verificar filme:', err);
   }
  }

  const people = peopleRes.data.results.slice(0, 5).map(p => ({
   id: p.id,
   title: p.name,
   poster: p.profile_path,
   type: p.known_for_department === 'Directing' ? 'director' : 'actor',
   subtitle: p.known_for_department === 'Directing' ? 'Diretor' : 'Ator',
  }));

  searchResults.value = [...movies, ...people];

  if (searchResults.value.length === 0) {
   noResultsFound.value = true;
  }

 } catch (error) {
  console.error('Erro na busca:', error);
  noResultsFound.value = true;
 } finally {
  isSearching.value = false;
 }
};

const selectResult = (result) => {
  emit('select-result', result);
  closeSearch();
};

const closeSearch = () => {
 emit('close');
 searchQuery.value = '';
 searchResults.value = [];
 noResultsFound.value = false;
};

watch(() => props.isOpen, (value) => {
 if (!value) {
  searchQuery.value = '';
  searchResults.value = [];
  noResultsFound.value = false;
 }
});;
</script>

<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div v-if="isOpen" class="search-overlay" @click.self="closeSearch">
        <div class="search-box">
          <div class="search-top">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              class="search-field"
              placeholder="Buscar filmes, atores, diretores..."
              autofocus
            />
            <button @click="closeSearch" class="btn-close">✕</button>
          </div>

          <div v-if="isSearching" class="search-status">
            <div class="spinner"></div>
            <p>Buscando...</p>
          </div>

          <div v-else-if="searchResults.length > 0" class="results-list">
            <div
              v-for="item in searchResults"
              :key="`${item.type}-${item.id}`"
              @click="selectResult(item)"
              class="result-item"
            >
              <div class="result-thumb">
                <img
                  v-if="item.poster"
                  :src="`https://image.tmdb.org/t/p/w92${item.poster}`"
                  :alt="item.title"
                />
                <div v-else class="thumb-empty">
                  {{ item.type === 'movie' ? '🎬' : '👤' }}
                </div>
              </div>

              <div class="result-text">
                <h4>{{ item.title }}</h4>
                <p>
                  {{ item.type === 'movie' ? 'Filme' : item.subtitle }}
                  <span v-if="item.year"> • {{ item.year }}</span>
                </p>
              </div>
            </div>
          </div>
          <div v-else-if="noResultsFound" class="search-status">
      <p>Nenhum resultado para "{{ searchQuery }}"</p>
     </div>

          <div v-else class="search-status">
      <p>Digite pelo menos 2 caracteres e pressione Enter</p>
     </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.95);
z-index: 10000;
display: flex;
align-items: flex-start;
justify-content: center;
padding: 50px 20px;
overflow-y: auto;
}

.search-box {
  width: 100%;
  max-width: 700px;
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-top {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-field {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 15px 20px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.3s;
}

.search-field:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
}

.search-field::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.btn-close {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 50px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.btn-close:hover {
  background: #fff;
  color: #000;
}

.search-status {
  padding: 60px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.results-list {
  max-height: 500px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  gap: 15px;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.result-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.result-thumb {
  width: 50px;
  height: 75px;
  flex-shrink: 0;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.result-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-empty {
  font-size: 24px;
  opacity: 0.3;
}

.result-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.result-text h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.result-text p {
  margin: 0;
  font-size: 13px;
  color: #888;
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.3s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .search-overlay {
    padding: 80px 15px 15px;
  }

  .search-top {
    flex-direction: column;
    gap: 10px;
  }

  .btn-close {
    width: 100%;
  }
}
</style>
