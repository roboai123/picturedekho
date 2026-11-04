
const movies = [
  {
    id: 1,
    title: "RRR",
    genre: "Action · Drama",
    language: "Telugu · Hindi · Tamil",
    rating: "8.0",
    poster: "https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwD7q5L3j9.jpg"
  },
  {
    id: 2,
    title: "Oppenheimer",
    genre: "Biography · Drama",
    language: "English · Hindi",
    rating: "8.3",
    poster: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg"
  },
  {
    id: 3,
    title: "Kalki 2898 AD",
    genre: "Sci-Fi · Action",
    language: "Telugu · Hindi",
    rating: "7.5",
    poster: "https://image.tmdb.org/t/p/w500/1k4gp0z6Y1H8QJ9pV5w0Q7l3xVQ.jpg"
  },
  {
    id: 4,
    title: "Stree 2",
    genre: "Horror · Comedy",
    language: "Hindi",
    rating: "7.2",
    poster: "https://image.tmdb.org/t/p/w500/4W7g8rT5Q0xZ9fJ2k6vL3j9.jpg"
  }
];

const cinemas = [
  "Vedant PVR",
  "Ashish Palace",
  "Sangam Palace"
];

const times = [
  "11:00 AM",
  "2:30 PM",
  "6:00 PM",
  "9:15 PM"
];

const ticketPrice = 180;

let currentMovie = null;
let currentCinema = "";
let currentTime = "";
let selectedSeats = new Set();
let bookedSeats = {};

function loadMovies(filter = "") {
  const root = document.getElementById("movies");
  if (!root) return;

  root.innerHTML = "";

  const filtered = movies.filter(movie =>
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    root.innerHTML =
      '<p class="empty">No movies found. Try another title.</p>';
    return;
  }

  filtered.forEach(movie => {
    const card = document.createElement("article");
    card.className = "movie";

    card.innerHTML = `
      <img
        class="poster"
        src="${movie.poster}"
        alt="${movie.title} poster"
        loading="lazy"
      >

      <div class="movie-info">
        <span class="pill">NOW SHOWING · DEMO</span>
        <h3>${movie.title}</h3>

        <div class="meta">
          ${movie.genre}<br>
          ${movie.language}<br>
          ★ ${movie.rating} / 10
        </div>

        <button class="primary" data-movie-id="${movie.id}">
          View Showtimes
        </button>
      </div>
    `;

    const poster = card.querySelector(".poster");

    poster.addEventListener("error", () => {
      poster.onerror = null;
      poster.src =
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80";
    });

    card.querySelector("button").addEventListener("click", () => {
      openMovie(movie.id);
    });

    root.appendChild(card);
  });
}

function openMovie(id) {
  currentMovie = movies.find(movie => movie.id === id);
  if (!currentMovie) return;

  selectedSeats.clear();

  const booking = document.getElementById("booking");
  booking.classList.add("show");

  document.getElementById("booking-title").textContent =
    currentMovie.title + " — Showtimes";

  document.getElementById("booking-subtitle").textContent =
    currentMovie.genre + " · Fictional demo listings";

  document.getElementById("seat-area").classList.remove("show");

  document.getElementById("cinemas").innerHTML =
    cinemas.map((cinema, index) => `
      <div class="cinema">
        <div class="cinema-head">
          <span>${cinema}</span>
          <span class="muted">Screen ${index + 1} · Demo</span>
        </div>

        <div class="shows">
          ${times.map(time => `
            <button class="showtime"
              data-cinema="${cinema}"
              data-time="${time}">
              ${time}
            </button>
          `).join("")}
        </div>
      </div>
    `).join("");

  document.querySelectorAll(".showtime").forEach(button => {
    button.addEventListener("click", () => {
      chooseShow(
        button.dataset.cinema,
        button.dataset.time,
        button
      );
    });
  });

  booking.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function getShowKey() {
  return [
    currentMovie.id,
    currentCinema,
    currentTime
  ].join("|");
}

function chooseShow(cinema, time, button) {
  currentCinema = cinema;
  currentTime = time;
  selectedSeats.clear();

  document.querySelectorAll(".showtime").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");

  document.getElementById("seat-area").classList.add("show");

  document.getElementById("seat-heading").textContent =
    cinema + " · " + time;

  document.getElementById("seat-subheading").textContent =
    "Movie: " + currentMovie.title +
    " · ₹" + ticketPrice + " per seat · Demo only";

  renderSeats();

  document.getElementById("seat-area").scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

function renderSeats() {
  const root = document.getElementById("seats");
  if (!root || !currentMovie) return;

  root.innerHTML = "";

  const key = getShowKey();

  // These are fictional booked seats for demonstration.
  if (!bookedSeats[key]) {
    bookedSeats[key] = new Set([
      "A3", "B7", "C5", "D2", "E9", "F4"
    ]);
  }

  const rows = "ABCDEF";

  for (const row of rows) {
    for (let number = 1; number <= 10; number++) {
      const seatId = row + number;
      const seat = document.createElement("button");

      seat.className = "seat";
      seat.textContent = seatId;
      seat.setAttribute("aria-label", "Seat " + seatId);

      if (bookedSeats[key].has(seatId)) {
        seat.classList.add("booked");
        seat.textContent = "BOOKED";
        seat.disabled = true;
        seat.title = "Already booked in this demo";
      } else if (selectedSeats.has(seatId)) {
        seat.classList.add("selected");
        seat.title = "Click to deselect";
        seat.setAttribute("aria-pressed", "true");
      } else {
        seat.title = "Available seat " + seatId;
        seat.setAttribute("aria-pressed", "false");
      }

      seat.addEventListener("click", () => {
        if (bookedSeats[key].has(seatId)) return;

        if (selectedSeats.has(seatId)) {
          selectedSeats.delete(seatId);
        } else {
          selectedSeats.add(seatId);
        }

        renderSeats();
      });

      root.appendChild(seat);
    }
  }

  updateSummary();
}

function updateSummary() {
  const label = document.getElementById("selected-label");
  const total = document.getElementById("total");

  const seats = Array.from(selectedSeats).sort();

  label.textContent = seats.length
    ? seats.join(", ")
    : "No seats selected";

  total.textContent = "₹" + (seats.length * ticketPrice);
}

function confirmBooking() {
  if (!currentMovie || !currentCinema || !currentTime) {
    showToast("Please select a movie, cinema and showtime.");
    return;
  }

  if (selectedSeats.size === 0) {
    showToast("Please select at least one available seat.");
    return;
  }

  const key = getShowKey();

  // Prevent seats from being selected again in this page session.
  if (!bookedSeats[key]) {
    bookedSeats[key] = new Set();
  }

  const seats = Array.from(selectedSeats).sort();

  seats.forEach(seat => bookedSeats[key].add(seat));

  const bookingId =
    "PD" + Math.random().toString(36).slice(2, 7).toUpperCase();

  const totalPrice = seats.length * ticketPrice;

  selectedSeats.clear();
  renderSeats();

  showToast(
    "Demo booking confirmed! " +
    seats.join(", ") +
    " · Total ₹" + totalPrice +
    " · ID " + bookingId
  );

  document.getElementById("booking-subtitle").textContent =
    "Demo booking completed · " +
    currentCinema + " · " + currentTime;
}

function closeBooking() {
  document.getElementById("booking").classList.remove("show");
}

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("input", event => {
    loadMovies(event.target.value);
  });
}

loadMovies();
