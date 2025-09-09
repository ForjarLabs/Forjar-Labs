document.addEventListener("DOMContentLoaded", async function () {
  const articlesPerPage = 6;
  let currentPage = 1;
  let articles = [];

  const articleGrid = document.querySelector(".article-grid");
  const currentPageElement = document.querySelector(".current-page");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  // Render articles for a given page
  function renderPage(page) {
    articleGrid.innerHTML = "";

    const start = (page - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const pageArticles = articles.slice(start, end);

    pageArticles.forEach((article) => {
      articleGrid.innerHTML += `
        <div class="article">
          <div class="article-top">
            <img src="${article.image_path}" alt="Article Image" />
          </div>
          <div class="article-bottom">
            <h4>(${article.author})</h4>
            <h2><a href="/article">${article.title}</a></h2>
            <p>${article.except}</p>
          </div>
        </div>`;
    });

    currentPageElement.textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable buttons at edges
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }

  try {
    const response = await fetch("/assets/js/test.json");
    const data = await response.json();
    articles = data.data;

    totalPages = Math.ceil(articles.length / articlesPerPage);

    renderPage(currentPage);

    // Pagination events
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        smoothScrollToTop(1000); // 👈 slower scroll (1.5s)
      }
    });

    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
        smoothScrollToTop(1000); // 👈 slower scroll (1.5s)
      }
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
});


function smoothScrollToTop(duration = 1000) {
  const start = window.scrollY;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);

    // Apply easing (easeOutQuad)
    const easedProgress = 1 - Math.pow(1 - rawProgress, 2);

    window.scrollTo(0, start * (1 - easedProgress));

    if (rawProgress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
