// Helper function to strip HTML
function stripHTML(html) {
  let doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

// Initialize global variables
let isAuthenticated = true;
let myChart = null;
let quill = null;

// Login Function
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const loginError = document.getElementById("loginError");

  if (!email || !password) {
    loginError.textContent = "Please enter both email and password.";
    loginError.style.display = "block";
    return;
  }

  try {
    const { auth } = await initializeFirebase();
    const { signInWithEmailAndPassword } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
    );

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Login successful:", userCredential.user.uid);

    isAuthenticated = true;
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("logoutButton").style.display = "inline-block";

    // Show active tab content
    document.querySelector(".tab-content.active").style.display = "block";

    // Load initial data
    await loadPosts("postsList");
    await loadDrafts();
    await fetchMetrics();
  } catch (error) {
    console.error("Login error:", error);
    loginError.textContent = `Login failed: ${error.message}`;
    loginError.style.display = "block";
  }
}

// Logout Function
async function logout() {
  try {
    const { auth } = await initializeFirebase();
    const { signOut } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
    );

    await signOut(auth);
    isAuthenticated = false;
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("logoutButton").style.display = "none";

    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach((tab) => {
      if (tab.id !== "login-screen") {
        tab.style.display = "none";
      }
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// Load posts function
async function loadPosts(targetId = "postsList") {
  const postsList = document.getElementById(targetId);
  postsList.innerHTML = "Loading posts...";

  try {
    const response = await fetch("/api/getPosts.php");
    const data = await response.json();

    if (!data.success) {
      document.getElementById(
        targetId
      ).innerHTML = `<p style="color:red;">Failed to load posts: ${
        data.error || "Unknown error"
      }</p>`;
      return;
    }

    postsList.innerHTML = "";

    for (const postData of data.articles) {
      const data = postData;

      const coverImageUrl = "../assets/images/placeholder.jpg";
      const title = data.title || "Untitled";
      const date =
        data.date ||
        (data.created_at
          ? new Date(data.created_at).toLocaleDateString()
          : "Unknown");

      const rawContent = data.content || "";
      const plainText = data.plaintext;
      const wordCount = plainText.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      const excerpt = data.excerpt || plainText.substring(0, 100) + "...";
      const authorImage = data.authorImage || "../assets/images/author.jpg";
      const authorName = data.author || "Unknown Author";

      const postCard = document.createElement("div");
      postCard.className = "post-card";
      postCard.style.display = "block";

      postCard.innerHTML = `
        <img src="${data.image_path}" alt="${title}" onerror="this.src='${coverImageUrl}';">
        <div class="post-content">
          <h3><a href="/article.php?id=${data.id}" class="post-link">${title}</a></h3>
          <div class="meta">Posted on ${date} • ${readTime} min read</div>
          <p>${excerpt}</p>
          <div class="author">
            <span>${authorName}</span>
          </div>
          <h5> ${data.views} views </h5>
          <div class="post-actions">
            <button class="delete-button" data-id="${data.id}">Delete</button>
            <button class="post-edit" data-id="${data.id}">Edit</button>
          </div>
        </div>
      `;

      postsList.appendChild(postCard);

      // Delete post
      const deleteButton = postCard.querySelector(".delete-button");
      deleteButton.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Are you sure you want to permanently delete this post?"
        );
        if (!confirmDelete) return;

        try {
          fetch("/api/delete.php", {
            method: "POST",
            body: new URLSearchParams({
              id: data.id,
              deleteImages: true,
            }),
          })
            .then((res) => res.json())
            .then(console.log);
          postCard.remove(); // Remove from DOM
          alert("Post deleted successfully.");
        } catch (err) {
          console.error("Error deleting post:", err);
          alert("Failed to delete post.");
        }
      });

      // Edit post
      const editButton = postCard.querySelector(".post-edit");
      editButton.addEventListener("click", async () => {
        try {
          const response = await fetch(`/api/get.php?id=${data.id}`);
          const fetchedData = await response.json();

          if (!fetchedData.success) {
            console.error("Error fetching post:", fetchedData.error);
            alert("Post not found");
          }

          const postData = fetchedData.article;

          document.getElementById("postTitle").value = postData.title || "";
          document.getElementById("author").textContent = postData.author || "";

          const delta = quill.clipboard.convert(postData.content || "");
          quill.setContents(delta || []);

          document.getElementById("preview").src =
            postData.image_path || "../assets/images/placeholder.jpg";

          document.querySelector(".tab-link[data-tab='write']").click();
          window.editingPostId = data.id;
        } catch (err) {
          console.error("Error loading post for edit:", err);
          alert("Failed to load post for editing.");
        }
      });
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    postsList.innerHTML = "Error loading posts.";
  }
}

// Load drafts
async function loadDrafts() {
  const list = document.getElementById("draftsList");
  list.innerHTML = "Loading drafts...";

  const coverImageUrl = "../assets/images/placeholder.jpg";

  try {
    const response = await fetch("/api/getDrafts.php");
    const data = await response.json();

    if (!data.success) {
      list.innerHTML = `<p style="color:red;">Failed to load posts: ${
        data.error || "Unknown error"
      }</p>`;
      return;
    }

    list.innerHTML = "";
    for (const draft of data.drafts) {
      const data = draft;
      const item = document.createElement("div");
      item.className = "post-card";
      const authorName = draft.author || "Unknown Author";
      item.style.display = "block";
      item.innerHTML = ` 

        <img src="${data.image_path}" alt="${
        data.title || "No tiltle"
      }" onerror="this.src='${coverImageUrl}';">
        <div class="post-content">
          <h3>${data.title || "Untitled Draft"}</h3>
          <p>${data.excerpt || "No excerpt"}</p>
          <div class="author">
            <span>${authorName}</span>
          </div>
          <div class="post-actions">
             <button data-id="${draft.id}" class="edit-draft">Edit</button>
              <button data-id="${draft.id}" class="delete-draft">Delete</button>
          </div>
        </div>
            `;
      list.appendChild(item);

      item.querySelector(".edit-draft").addEventListener("click", () => {
        document.getElementById("postTitle").value = data.title || "";
        document.getElementById("author").textContent = data.author || "";
        const delta = quill.clipboard.convert(data.content || "");
        quill.setContents(delta || []);

        document.getElementById("preview").src =
          data.image_path || "../assets/images/placeholder.jpg";

        window.editingDraftId = data.id;
        document.querySelector(".tab-link[data-tab='write']").click();
      });

      item
        .querySelector(".delete-draft")
        .addEventListener("click", async () => {
          if (confirm("Delete this draft?")) {
            fetch("/api/deleteDraft.php", {
              method: "POST",
              body: new URLSearchParams({
                id: data.id,
                deleteImages: true,
              }),
            })
              .then((res) => res.json())
              .then(console.log);

            alert("Draft deleted successfully.");
            loadDrafts();
          }
        });
    }
  } catch (err) {
    console.error("Failed to load drafts:", err);
    list.innerHTML = "Error loading drafts.";
  }
}

// Fetch Metrics Function
async function fetchMetrics() {
  if (!isAuthenticated) return;
  try {
    const response = await fetch("/api/getPosts.php");
    const data = await response.json();
    if (!data.success) throw new Error(data.error || "Failed to fetch posts");

    let totalViews = 0;
    let totalComments = 0;
    let mostViewed = { title: "No posts", views: -1 };

    for (const doc of data.posts) {
      const data = doc;
      const views = parseInt(data.views) || 0;
      totalViews += views;
      if (views > mostViewed.views) {
        mostViewed = { title: data.title || "Untitled", views };
      }
      // try {
      //   const { db } = await initializeFirebase();
      //   const { collection, query, where, getDocs } = await import(
      //     "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      //   );
      //   const commentsRef = collection(db, "comments");
      //   const q = query(commentsRef, where("postId", "==", doc.id));
      //   const commentsSnapshot = await getDocs(q);

      //   totalComments += commentsSnapshot.size;
      // } catch (err) {
      //   console.warn(`Couldn't count comments for ${doc.id}:`, err.message);
      // }
    }

    document.getElementById("totalPosts").textContent = data.posts.length;
    document.getElementById("totalViews").textContent =
      totalViews.toLocaleString();
    document.getElementById("totalComments").textContent = totalComments;
    document.getElementById(
      "mostViewedArticle"
    ).textContent = `${mostViewed.title} (${mostViewed.views} views)`;
  } catch (error) {
    console.error("Dashboard error:", error);
    document.getElementById("mostViewedArticle").textContent =
      "Error loading data";
  }
}

// Initialize Quill editor
function initializeQuill() {
  quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          ["link", "image"], // Add image button
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        handlers: {
          image: imageHandler, // Our custom upload function
        },
      },
    },
  });
}

function imageHandler() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/uploadImage.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", data.url); // Insert uploaded image
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Image upload error", err);
      alert("Image upload failed!");
    }
  };
}

// Tab switching logic
function setupTabs() {
  const tabNames = {
    dashboard: "Dashboard",
    write: "Write a Post",
    "all-posts": "All Posts",
    drafts: "Drafts",
    settings: "Settings",
    "blog-frontend": "Blog Frontend",
  };

  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (!isAuthenticated) return;

      const target = tab.dataset.tab;
      tabLinks.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => {
        c.classList.remove("active");
        c.style.display = "none";
      });

      tab.classList.add("active");
      const targetTab = document.getElementById(target);
      targetTab.classList.add("active");
      targetTab.style.display = "block";

      document.getElementById("tabTitle").textContent = tabNames[target];

      if (target === "all-posts") loadPosts("postsList");
      if (target === "drafts") loadDrafts();
    });
  });
}

// Publish Post Function
async function publishPost() {
  if (!isAuthenticated) return;

  const title = document.getElementById("postTitle").value.trim();
  const author = document.getElementById("author").value.trim();
  const plainText = quill.getText().trim().substring(0, 100) + "...";
  const excerpt = quill.getText().trim().substring(0, 150) + "...";
  const content = document.querySelector("#editor .ql-editor").innerHTML.trim();
  const imageUrl = document.getElementById("preview").src;

  // Validate required fields
  if (!title) {
    alert("Please enter a title.");
    return;
  }
  if (!content || content === "<p><br></p>") {
    alert("Post content cannot be empty.");
    return;
  }
  if (!imageUrl || imageUrl.includes("placeholder")) {
    alert("Please upload a valid image.");
    return;
  }
  if (!author) {
    alert("Please enter the author's name.");
    return;
  }

  const formData = new FormData();

  // Append form fields
  formData.append("title", title);
  formData.append("content", content);
  formData.append("plaintext", plainText);
  formData.append("author", author);
  formData.append("excerpt", excerpt);
  formData.append("image", imageUrl);

  try {
    if (window.editingPostId) {
      formData.append("id", window.editingPostId);

      const response = await fetch("/api/edit.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert("Post updated successfully!");
      } else {
        alert("Error: " + data.error);
      }

      window.editingPostId = null;
    } else {
      const response = await fetch("/api/upload.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!result.success) {
        alert("Error publishing post: " + (result.error || "Unknown error"));
        return;
      }

      if (window.editingDraftId) {
        fetch("/api/deleteDraft.php", {
          method: "POST",
          body: new URLSearchParams({
            id: window.editingDraftId,
            deleteImages: false,
          }),
        })
          .then((res) => res.json())
          .then(console.log);
        window.editingDraftId = null;
      }

      alert("Post published successfully!");
    }

    // Reset form
    document.getElementById("postTitle").value = "";
    document.getElementById("coverImage").value = "";
    document.getElementById("author").value = "";
    document.getElementById("preview").src = "../assets/images/placeholder.jpg";
    quill.setContents([]);

    await loadPosts("postsList");
  } catch (error) {
    console.error("Error publishing post:", error);
    alert("Failed to publish post. Check console for details.");
  }
}

// Save Draft Function
async function saveDraft() {
  if (!isAuthenticated) return;

  const title = document.getElementById("postTitle").value.trim();
  const author = document.getElementById("author").value.trim();
  const content = document.querySelector("#editor .ql-editor").innerHTML.trim();
  const plainText = quill.getText().trim();
  const excerpt =
    plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");
  const imageUrl = document.getElementById("preview").src;

  if (!title || plainText.length === 0) {
    alert("Title and content are required to save a draft.");
    return;
  }

  try {
    const formData = new FormData();

    // Append form fields
    formData.append("title", title);
    formData.append("content", content);
    formData.append("excerpt", excerpt);
    formData.append("image", imageUrl);
    formData.append("author", author);

    // Decide which endpoint to call
    const endpoint = window.editingDraftId
      ? "/api/editDraft.php"
      : "/api/uploadDraft.php";

    // Always attach the draft ID if editing
    if (window.editingDraftId) {
      formData.append("id", window.editingDraftId);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      alert("Error saving draft: " + (result.error || "Unknown error"));
      return;
    }

    alert("Draft saved successfully!");

    // Reset form
    document.getElementById("postTitle").value = "";
    document.getElementById("author").value = "";
    document.getElementById("coverImage").value = "";
    document.getElementById("preview").src = "../assets/images/placeholder.jpg";
    quill.setContents([]);

    await loadDrafts();
  } catch (error) {
    console.error("Error saving draft:", error);
    alert("Failed to save draft. Check console for details.");
  }
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("logoutButton").style.display = "inline-block";

  // Show active tab content
  document.querySelector(".tab-content.active").style.display = "block";
  try {
    // Initialize UI components
    initializeQuill();
    setupTabs();

    // Event listeners
    document.getElementById("loginButton").addEventListener("click", login);
    document.getElementById("logoutButton").addEventListener("click", logout);
    document
      .getElementById("publishPost")
      .addEventListener("click", publishPost);
    document.getElementById("saveDraft").addEventListener("click", saveDraft);

    // onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     const idTokenResult = await user.getIdTokenResult();
    //     console.log("User ID Token Result:", idTokenResult);
    //     if (idTokenResult.claims.firebase?.sign_in_provider == "password") {
    //       isAuthenticated = true;
    //       document.getElementById("login-screen").style.display = "none";
    //       document.getElementById("logoutButton").style.display =
    //         "inline-block";

    //       // Show active tab content
    //       document.querySelector(".tab-content.active").style.display = "block";
    //     } // 'password', 'google.com', etc.
    //   } else {
    //     console.log("No user is signed in.");
    //   }
    // });
  } catch (err) {
    console.error("Failed to initialize Firebase:", err);
  }
});

document
  .getElementById("coverImage")
  .addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (file === 0) {
      alert("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/uploadImage.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      document.getElementById("preview").src = result.url;
    } catch (error) {
      console.error("Error uploading to server:", error);
      alert("Error uploading image.");
    }
  });
