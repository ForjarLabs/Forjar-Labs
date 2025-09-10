<?php
// db.php should contain your DB connection
include __DIR__ . "/api/db.php";

// Get post ID from query string (e.g., blog.php?id=5)
$postId = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Default meta values (fallbacks)
$title = "My Blog";
$description = "Forjar Labs is a lean global studio of senior designers, engineers, and problem solvers. We build scalable digital products, games, and systems.";
$image = "https://example.com/default-image.jpg";
$url = "https://forjarlabs.agency/post.php?id=" . $postId;

// Fetch post if valid ID
if ($postId > 0) {
    $stmt = $conn->prepare("SELECT title, content, image_path, excerpt FROM articles WHERE id = ?");
    $stmt->bind_param("i", $postId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $title = htmlspecialchars($row['title']);
        $description = !empty($row['excerpt']) 
            ? htmlspecialchars($row['excerpt']) 
            : substr(strip_tags($row['content']), 0, 160); // fallback
       $image = !empty($row['image_path']) 
    ? $row['image_path'] 
    : $image;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>

 <title><?= $title ?> - Forjar Labs </title>

    <!-- Open Graph -->
  <meta property="og:title" content="<?= $title ?>">
  <meta property="og:description" content="<?= $description ?>">
  <meta property="og:image" content="<?= $image ?>">
  <meta property="og:url" content="<?= $url ?>">
  <meta property="og:type" content="website">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= $title ?>">
  <meta name="twitter:description" content="<?= $description ?>">
  <meta name="twitter:image" content="<?= $image ?>">
  <meta name="twitter:site" content="@forjarlabs" />
    <!-- Google tag (gtag.js) -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-5SJ6WTTPN7"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "G-5SJ6WTTPN7");
    </script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="description"
      content="Forjar Labs is a lean global studio of senior designers, engineers, and problem solvers. We build scalable digital products, games, and systems."
    />
    <meta
      name="keywords"
      content="Forjar Labs, product design, software engineering, game development, UX, full-stack"
    />
    <meta name="author" content="Forjar Labs" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://forjarlabs.agency/" />

    <!-- Open Graph for social sharing -->
    <meta
      property="og:title"
      content="Forjar Labs – Digital Products, Games & Systems"
    />
    <meta
      property="og:description"
      content="A lean global studio of senior designers and engineers. We build digital products and systems that scale."
    />
    <meta property="og:image" content="/og-image.jpg" />
    <meta property="og:url" content="https://forjarlabs.agency/" />
    <meta property="og:type" content="website" />

    <!-- Favicon Icons -->
    <link rel="icon" type="image/x-icon" href="/assets/favicons/favicon.ico" />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/asssets/favicons/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/assets/favicons/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/assets/favicons/favicon-16x16.png"
    />
    <link rel="manifest" href="/assets/favicons/site.webmanifest" />
    <link rel="shortcut icon" href="/assets/favicons/favicon.ico" />

    <!-- Google Fonts: Inter and Anton SC -->
    <link
      href="https://fonts.googleapis.com/css2?family=Anton+SC&family=Inter:wght@400;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- External CSS -->
    <link rel="stylesheet" href="/assets/css/style.css" />
    <link rel="stylesheet" href="/assets/css/journal.css" />
    <link rel="stylesheet" href="/assets/css/article.css" />

    <!-- Optional: Light/Dark Theme Prep -->
    <meta name="color-scheme" content="light dark" />
  </head>
  <body>
    <!-- Header -->
<div id="header-placeholder"></div>

    <!-- post -->
    <section id="post">
      <div class="post-container">
        <div class="article-header">
          <h2></h2>
          <p class="excerpt"></p>
        </div>
        <img
          src="<?= $image ?>"
          alt="Post Image"
          class="post-image"
        />
        <div class="post-body">
          <hr />
          <div class="post-header">
            <div class="author">
              <img src="../assets/images/author.jpg" alt="Author" />
              <div>
                <span class="author-name"></span>
                <div class="meta minutes"></div>
              </div>
            </div>
            <!-- <div class="social-links">
              <a href="#"><i class="fa-brands fa-square-x-twitter"></i></a>
              <a href="#"><i class="fa-brands fa-square-facebook"></i></a>
            </div> -->
          </div>
          <article id="postContent"></article>
          <div class="meta">
            Forjar Labs is a lean global studio of senior designers, engineers, and problem solvers. We build scalable digital products, games, and systems.
          </div>
          <div class="post-share">
            <a href="" id="facebook" target="_blank" rel="noopener">
              <span href="#"><i class="fa-brands fa-square-facebook"></i></span>
              <span>Share on Facebook</span>
            </a>
            <a href="" id="twitter" target="_blank" rel="noopener">
              <span href="#"
                ><i class="fa-brands fa-square-x-twitter"></i
              ></span>
              <span href="#">Share on X(Twitter)</span>
            </a>
            <a href="" id="whatsapp" target="_blank" rel="noopener">
              <span href="#"><i class="fa-brands fa-square-whatsapp"></i></span>
              <span href="#">Share on Whatsapp</span>
            </a>
          </div>
        </div>
      </div>
      <hr />
    </section>

    <!-- Comments Section -->
    <!-- <section id="comments-section">
      <h3><i class="fa-solid fa-comments"></i> Comments</h3>

      <div id="auth-gate" class="hidden">
        <p>
          Please <button id="login-btn">log in</button> to comment. Or comment
          anonymously
        </p>
      </div>

      <form id="comment-form" class="hidden">
        <textarea
          id="comment-input"
          placeholder="Write a comment..."
          required
        ></textarea>
        <button type="submit">Post Comment</button>
      </form>

      <div id="comments-list"><p>Loading comments…</p></div>
      <button id="load-more-btn" class="hidden">Load more comments</button>
    </section> -->

    <!-- related posts -->
    <section id="related-posts">
      <div class="articles-header">
        <h2>related stories</h2>
      </div>
      <div class="related-grid" id="relatedPosts">
        <!-- Related posts will be dynamically inserted here -->
      </div>
    </section>

    <!-- Newsletter -->
    <!-- <section id="newsletter">
      <div class="newsletter-content">
        <h3>Sign up for the newsletter</h3>
        <p>
          If you want relevant updates occasionally, sign up for the private
          newsletter.<br />
          Your email is never shared.
        </p>
        <form class="newsletter-form" id="newsletter-form">
          <input
            type="email"
            id="newsletter-email"
            placeholder="Enter your email..."
            required
          />
          <button type="submit">SIGN UP</button>
        </form>
      </div>
      // Popup container 
      <div
        id="popup-message"
        style="
          display: none;
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          z-index: 999;
        "
      >
    </div>
    </section> -->
    <!-- Footer -->
<div id="footer-placeholder"></div>
   <script src="/assets/js/main.js"></script>
    <script type="module" src="/assets/js/article.js"></script>
  </body>
</html>
