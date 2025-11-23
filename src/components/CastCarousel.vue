<script setup>
import { ref } from 'vue';

const props = defineProps({
  cast: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['open-actor']);

const castScrollContainer = ref(null);

const scrollCast = (direction) => {
  if (castScrollContainer.value) {
    const scrollAmount = 400;
    castScrollContainer.value.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }
};
</script>

<template>
  <section class="cast-section" v-if="cast.length > 0">
    <div class="section-header">
      <h3>Elenco Principal</h3>
    </div>

    <div class="cast-carousel-wrapper">
      <button @click="scrollCast('left')" class="carousel-btn left">‹</button>

      <div class="cast-carousel" ref="castScrollContainer">
        <div
          v-for="actor in cast"
          :key="actor.id"
          @click="emit('open-actor', actor.id)"
          class="cast-card"
        >
          <div class="cast-photo-wrapper">
            <img
              v-if="actor.profile_path"
              :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`"
              :alt="actor.name"
              class="cast-photo"
            />
            <div v-else class="cast-photo-placeholder">
              <span>Foto Indisponível</span>
            </div>
          </div>
          <div class="cast-info">
            <h4 class="cast-name">{{ actor.name }}</h4>
            <p class="cast-character">{{ actor.character }}</p>
          </div>
        </div>
      </div>

      <button @click="scrollCast('right')" class="carousel-btn right">›</button>
    </div>
  </section>
</template>

<style scoped>
.cast-section {
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

.cast-carousel-wrapper {
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

.cast-carousel {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 1rem 0;
}

.cast-carousel::-webkit-scrollbar {
  display: none;
}

.cast-card {
  flex-shrink: 0;
  width: 150px;
  cursor: pointer;
  transition: transform 0.3s ease;
  text-align: center;
}

.cast-card:hover {
  transform: translateY(-8px);
}

.cast-photo-wrapper {
  width: 150px;
  height: 150px;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1a1a1a;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.cast-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cast-card:hover .cast-photo {
  transform: scale(1.1);
}

.cast-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.75rem;
  padding: 1rem;
  text-align: center;
}

.cast-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.cast-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cast-character {
  font-size: 0.8rem;
  color: #888888;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .cast-card {
    width: 120px;
  }

  .cast-photo-wrapper {
    width: 120px;
    height: 120px;
  }
}
</style>