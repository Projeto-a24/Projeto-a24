<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="a24-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <h3 class="footer-logo">A24</h3>
        <p class="footer-tagline">Cinema independente de alta qualidade</p>
      </div>

      <div class="footer-links">
        <div class="footer-column">
          <h4 class="footer-title">Navegação</h4>
          <ul class="footer-list">
            <li><router-link to="/" class="footer-link">Filmes</router-link></li>
            <li><router-link to="/actors" class="footer-link">Atores</router-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-title">Redes Sociais</h4>
          <ul class="footer-list">
            <li><a href="https://instagram.com/a24" target="_blank" rel="noopener" class="footer-link">Instagram</a></li>
            <li><a href="https://twitter.com/a24" target="_blank" rel="noopener" class="footer-link">Twitter</a></li>
            <li><a href="https://youtube.com/a24" target="_blank" rel="noopener" class="footer-link">YouTube</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">
        © {{ currentYear }} A24 FILMS. Todos os direitos reservados.
      </p>
      <p class="footer-credits">
        Dados fornecidos por <a href="https://www.themoviedb.org/" target="_blank" rel="noopener" class="tmdb-link">The Movie Database (TMDB)</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.a24-footer {
  background-color: #000000;
  color: #ffffff;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 6rem;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 5rem 2rem 3rem 2rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 4rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.footer-tagline {
  font-size: 0.9rem;
  color: #888888;
  letter-spacing: 0.05em;
  line-height: 1.6;
  max-width: 300px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-link {
  text-decoration: none;
  color: #888888;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  transition: color 0.3s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #ffffff;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  text-align: center;
}

.footer-copyright {
  font-size: 0.8rem;
  color: #666666;
  letter-spacing: 0.1em;
  margin: 0 0 0.5rem 0;
}

.footer-credits {
  font-size: 0.75rem;
  color: #555555;
  margin: 0;
}

.tmdb-link {
  color: #01d277;
  text-decoration: none;
  transition: color 0.3s ease;
}

.tmdb-link:hover {
  color: #01b869;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 3rem 1.5rem 2rem 1.5rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-logo {
    font-size: 2.5rem;
  }

  .footer-bottom {
    padding: 1.5rem;
  }
}
</style>