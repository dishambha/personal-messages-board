const API_URL = "https://personal-messages-board-1.onrender.com/messages";

const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const emotionInput = document.getElementById("emotion");
const messageInput = document.getElementById("message");
const anonCheckbox = document.getElementById("isAnonymous");
const messagesDiv = document.getElementById("messages");
const charCount = document.getElementById("charCount");
const messageCount = document.getElementById("messageCount");
const emptyState = document.getElementById("emptyState");
const submitBtn = document.getElementById("submitBtn");

// Character counter
messageInput.addEventListener("input", () => {
  const count = messageInput.value.length;
  charCount.textContent = count;
  
  if (count > 500) {
    charCount.style.color = "#ef4444";
  } else if (count > 400) {
    charCount.style.color = "#f59e0b";
  } else {
    charCount.style.color = "#64748b";
  }
});

// Handle anonymous toggle
anonCheckbox.addEventListener("change", () => {
  if (anonCheckbox.checked) {
    nameInput.value = "";
    nameInput.disabled = true;
    nameInput.placeholder = "Posting anonymously 🎭";
  } else {
    nameInput.disabled = false;
    nameInput.placeholder = "Enter your name (optional)";
  }
});

// Submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!messageInput.value.trim()) return;

  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';

  const payload = {
    name: anonCheckbox.checked ? null : nameInput.value,
    message: messageInput.value,
    emotion: emotionInput.value,
    is_anonymous: anonCheckbox.checked
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    form.reset();
    charCount.textContent = "0";
    nameInput.disabled = false;
    nameInput.placeholder = "Enter your name (optional)";
    
    // Success feedback
    submitBtn.innerHTML = '<span class="btn-text">Sent! ✓</span>';
    setTimeout(() => {
      submitBtn.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-icon">→</span>';
      submitBtn.disabled = false;
    }, 2000);
    
    loadMessages();
  } catch (error) {
    submitBtn.innerHTML = '<span class="btn-text">Error - Try Again</span>';
    submitBtn.disabled = false;
  }
});

// Get emotion emoji
function getEmotionEmoji(emotion) {
  const emojis = {
    funny: "😄",
    kind: "💙",
    honest: "🪞",
    inspiring: "✨",
    respect: "🫡",
    grateful: "🙏",
    supportive: "🤗"
  };
  return emojis[emotion] || "";
}

// Load messages
async function loadMessages() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    messagesDiv.innerHTML = "";
    messageCount.textContent = data.length;

    if (data.length === 0) {
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    data.reverse().forEach(msg => {
      const card = document.createElement("div");
      card.className = "message-card";

      const emotionEmoji = getEmotionEmoji(msg.emotion);

      card.innerHTML = `
        <div class="message-header">
          <div class="message-name">${msg.name || "Anonymous"}</div>
          ${emotionEmoji ? `<div class="message-emotion">${emotionEmoji}</div>` : ''}
        </div>
        <div class="message-text">${escapeHtml(msg.message)}</div>
        <div class="message-time">${formatDate(msg.created_at)}</div>
      `;

      messagesDiv.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading messages:", error);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format date nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

// Initial load
loadMessages();