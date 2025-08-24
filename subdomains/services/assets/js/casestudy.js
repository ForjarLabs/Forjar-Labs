document.addEventListener("DOMContentLoaded", () => {
  const index = localStorage.getItem("index") || 0;

  console.log(index);

  fetch("/assets/data/casestudy.json")
    .then((response) => response.json()) // parse JSON from response
    .then((data) => {
      const casestudy = data.casestudies[index];

      //HERO SECTION
      const hero_left = document.querySelector(".hero-left");
      hero_left.innerHTML += ` <h1>${casestudy.hero.title}</h1>
        <p>
          ${casestudy.hero.subtitle}
        </p>`;

      const hero_right = document.querySelector(".hero-right");
      hero_right.innerHTML = `<img src="${casestudy.hero.image}" alt="hero image" />`;

      // BACKSTORY SECTION
      const core_story_left = document.querySelector(".core-story-left");
      casestudy.coreStory.backstory.forEach((value) => {
        core_story_left.innerHTML += `<p> ${value} </p>`;
      });

      const project_type = document.querySelector("#project_type");
      const industry = document.querySelector("#industry");
      const services_provided = document.querySelector("#services_provided");
      const engagement_model = document.querySelector("#engagement_model");

      project_type.innerHTML = casestudy.coreStory.projectDetails.ProjectType;
      industry.innerHTML = casestudy.coreStory.projectDetails.Industry;
      services_provided.innerHTML =
        casestudy.coreStory.projectDetails.ServicesProvided;
      engagement_model.innerHTML =
        casestudy.coreStory.projectDetails.EngagementModel;

      const problem_column = document.querySelector(".problem-column");
      problem_column.innerHTML += ` <p> ${casestudy.coreStory.problemStatement} </p>`;

      // CLIENT SURVEY
      const client_survey_header = document.querySelector(
        ".client-survey-header"
      );
      client_survey_header.innerHTML += ` <p> ${casestudy.clientSurvey.intro} </p>`;

      const stats_row = document.querySelector(".stats-row");
      casestudy.clientSurvey.stats.forEach((value) => {
        stats_row.innerHTML += `<div class="stat-item">
          <h1>${value.percentage}</h1>
          <h5>${value.title}</h5>
          <p>
            ${value.description}
          </p>
        </div>`;
      });

      const summary_statement = document.querySelector(".summary-statement");
      casestudy.clientSurvey.summary.forEach((value) => {
        summary_statement.innerHTML += `<p>
            ${value}
          </p>`;
      });

      const summary_image = document.querySelector(".summary-image");
      summary_image.innerHTML = `<img src="${casestudy.clientSurvey.summaryImage}" alt="research image" />`;

      // SOLUTION SECTION
      const solution_header_row = document.querySelector(
        ".solution-header-row"
      );
      solution_header_row.innerHTML += ` <p> ${casestudy.solution.intro} </p>`;

      const solution_container = document.querySelector(".solution-container");
      const solutionItems = casestudy.solution.items;
      solutionItems.forEach((value, index) => {
        if (index % 2 == 0) {
          solution_container.innerHTML += `<div class="solution-row">
          <div class="solution-left-row">
            <div class="solution-item">
              <h5>${solutionItems[index].title}</h5>
              <p>
                ${solutionItems[index].description}
              </p>
            </div>
            <div class="solution-item">
              <h5>${solutionItems[index + 1].title}</h5>
              <p>
                ${solutionItems[index + 1].description}
              </p>
            </div>
          </div>
          <div class="solution-right-row">
            <img src="${solutionItems[index].image}" alt="solution image" />
          </div>
        </div>`;
        }
      });

      // TRANSFORMATION SECTION

      const before_text = document.querySelector(".before-text");
      before_text.innerHTML = casestudy.transformation.before.description;

      const after_text = document.querySelector(".after-text");
      after_text.innerHTML = casestudy.transformation.after.description;

      const before_features = document.querySelector(".before-features");
      casestudy.transformation.before.features.forEach((value) => {
        before_features.innerHTML += `<li>${value}</li>`;
      });

      console.log("hi");

      const after_features = document.querySelector(".after-features");
      casestudy.transformation.after.features.forEach((value) => {
        after_features.innerHTML += `<li>${value}</li>`;
      });

      // IMPACT SECTION
      const impact_intro = document.querySelector(".impact-intro");
      impact_intro.innerHTML = casestudy.impact.intro;

      const observation_container = document.querySelector(
        ".observation-container"
      );

      casestudy.impact.observations.forEach((value) => {
        observation_container.innerHTML += `<div class="observation-item">
            <h1 class="yellow-highlight">${value.stat}</h1>
            <h4>${value.title}</h4>
            <p>
              ${value.description}
            </p>
          </div>`;
      });

      // MORE INSIGHTS SECTION
      const insights_container = document.querySelector(".insights-container");
      casestudy.insights.forEach((value) => {
        const insights_div = document.createElement("div");
        insights_div.classList = "insights-column";

        insights_div.innerHTML = `<h4>${value.title}</h4>`;
        value.content.forEach((content) => {
          insights_div.innerHTML += `<p>${content}</p>`;
        });
        insights_container.appendChild(insights_div);
      });

      const review = document.querySelector(".review");
      review.innerHTML = casestudy.review.quote;

      const client = document.querySelector(".client");
      client.innerHTML = casestudy.review.author;
    })
    .catch((error) => console.error("Error loading JSON:", error));
});
