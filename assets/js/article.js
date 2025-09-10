// import { setupComments } from "./comments.js";

function getPostIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function fetchPost(postId) {
  const response = await fetch(`/api/blog.php?id=${postId}`);
  return await response.json();
}

function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

async function displayPost() {
  const postId = getPostIdFromURL();
  if (!postId) {
    document.getElementById("postContent").innerHTML = "<p>Post ID not found.</p>";
    return;
  }

  try {
    const data = await fetchPost(postId);
    if (!data.success) {
      document.getElementById("postContent").innerHTML =
        "<p>Post not found.</p>";
      return;
    }

    const post = data.article;
    const related = data.related;

    // Calculate reading time
    const plainText = stripHTML(post.plaintext || "");
    const words = plainText.split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    const date = post.date
      ? new Date(post.date).toDateString()
      : "Unknown";

    // Fill content
    document.querySelector("h2").textContent = post.title || "Untitled";
    document.querySelector(".excerpt").textContent = post.excerpt || "";
    document.querySelector(
      ".minutes"
    ).innerHTML = `${date} • ${readTime} min read`;
    document.querySelector(".author span").textContent =
      post.author || "The team";
    document.getElementById("postContent").innerHTML =
      post.content || "<p>No content available.</p>";

    // Share links
    const fullUrl = window.location.href;
    document.getElementById(
      "facebook"
    ).href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      fullUrl
    )}`;
    document.getElementById(
      "twitter"
    ).href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      fullUrl
    )}&text=${encodeURIComponent(post.title)}`;
    document.getElementById(
      "whatsapp"
    ).href = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      post.title
    )}%20${encodeURIComponent(fullUrl)}`;

    // Related posts
    const relatedContainer = document.getElementById("relatedPosts");
    relatedContainer.innerHTML = "";
    related.forEach((article) => {
      relatedContainer.innerHTML += `
         <div class="article">
          <div class="article-top">
            <img src="${article.image_path}" alt="Article Image" />
          </div>
          <div class="article-bottom">
            <h4>(${article.author})</h4>
            <h2><a href="/article.php?id=${article.id}" class="post-link">${article.title}</a></h2>
            <p>${article.excerpt}</p>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error("Error fetching post:", err);
    document.getElementById("postContent").innerHTML =
      "<p>Error loading post.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {

  displayPost();

//   const postId = getPostIdFromURL();
//   if (postId) {
//     setupComments(postId);
//   }
});
