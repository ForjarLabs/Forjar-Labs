import data from "../data/portfolio.json" with { type: "json" };

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
  
    const id = parseInt(urlParams.get("id"));

    if(id >= data.jobs.length) {
        window.location.replace("/");
        return;
    }

    const item = data.jobs[id];

    var roles = "";
    item["role"].forEach((value) => {
        roles += `<li> ${value} </li>`;
    });

    var results = "";
    item["results"].forEach((value) => {
        results += `<li> ${value} </li>`;
    });

    document.querySelector(`#job`).innerHTML += ` 
        <div class="hero">
        <h2>${item.title}</h2>
        <p>
          ${item.hero_description}
        </p>
        <div class="desc">
          <div class="role">
            <h4>Our Role</h4>
            <ul>
              ${roles}
            </ul>
          </div>
          <div class="result">
            <h4>Results</h4>
            <ul>
              ${results}
            </ul>
          </div>
        </div>
      </div>
      <img src="../../assets/images/${item.hero_image}" alt="" />
      <div class="thechallenge">
        <div class="challenge">
          <h4>The Challenge</h4>
          <p>
           ${item.challenge}
          </p>
        </div>
        <img src="../../assets/images/challenge.png" alt="" />
      </div>

      <div class="approach">
        <div class="approach-intro">
          <h4>Our Approach</h4>
          <p>
            ${item.approach}
          </p>
          <h5>${item.approach1_title}</h5>
          <p>
            ${item.approach1_body}
          </p>
        </div>
        <img src="../../assets/images/${item.approach1_image}" alt="" />

        <div class="approach-split">
          <div>
            <h5>${item.approach2_title}</h5>
            <p>
              ${item.approach2_body}
            </p>
          </div>
          <img src="../../assets/images/${item.approach2_image1}" alt="" />
        </div>

        <img src="../../assets/images/${item.approach2_image2}" alt="" />

        <div class="approach-concluding">
          <h5>${item.approach3_title}</h5>
          <p>
           ${item.approach3_body}
          </p>
          <div class="approach-img-split">
            <img src="../../assets/images/${item.approach3_image1}" alt="" />
            <img src="../../assets/images/${item.approach3_image2}" alt="" />
            <img src="../../assets/images/${item.approach3_image3}" alt="" />
          </div>
          <h5>${item.approach4_title}</h5>
          <p>
            ${item.approach4_body}
          </p>
          <h5>${item.approach5_title}</h5>
          <p>
            ${item.approach5_body}
          </p>
        </div>
      </div>

      <div class="closing">
        <p>
          ${item.closing}
        </p>
        <p class="review">
          ${item.review}
        </p>
      </div>
      <div class="navigation">
        <p id="back"><a href="/portfolio/job/?id=${id-1}"><< BACK</a></p>
        <p id="next"><a href="/portfolio/job/?id=${id+1}">NEXT >></a></p>
      </div>
    `;

    if (id == 0) {
        document.getElementById("back").classList.add("not-vis");
    } else if(id == (data.jobs.length - 1)) {
        document.getElementById("next").classList.add("not-vis");
    }
  
  });
  
  