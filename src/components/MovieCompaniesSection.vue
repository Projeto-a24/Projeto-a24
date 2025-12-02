<script setup>
const props = defineProps({
  companies: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section v-if="companies.length" class="companies-section">
    <h3 class="companies-title">Produção</h3>
    <div class="companies-grid">
      <div
        v-for="company in companies"
        :key="company.id"
        class="company-card"
      >
        <img
          v-if="company.logo_path"
          :src="`https://image.tmdb.org/t/p/w200${company.logo_path}`"
          :alt="company.name"
          class="company-logo"
        />
        <span v-else class="company-name">{{ company.name }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.companies-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.companies-title {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 2rem 0;
  text-align: center;
  color: #888888;
}

.companies-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.company-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.company-logo {
  max-width: 120px;
  max-height: 50px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.company-logo:hover {
  opacity: 1;
}

.company-name {
  font-size: 0.8rem;
  color: #666666;
  text-align: center;
  letter-spacing: 0.05em;
}

</style>
