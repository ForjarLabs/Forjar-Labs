
import data from "../data/portfolio.json" with { type: "json" };

document.addEventListener('DOMContentLoaded', function () {
  const item = data.jobs;

  item.forEach( (value, i) => {
  document.querySelector(`.portfolio_body`).innerHTML += ` <div class="portfolio_body_item">
      <img src="../assets/images/${value.img_name}" alt="">
      <div class="portfolio_body_item_desc">
        <h2>${value.title}</h2>
        <h4>${value.description}</h4>
        <a href="/portfolio/job?id=${i}"><p>Read Case Study</p></a>
      </div>
  </div>`;
  })
}); 