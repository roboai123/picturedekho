
const movies = [
  { id: 1, title: "Ramayana", genre: "Mythology · Adventure", language: "Hindi · Telugu · Tamil", rating: "Upcoming", poster: "" },
  { id: 2, title: "Udta Teer", genre: "Comedy", language: "Hindi", rating: "Check listings", poster: "" },
  { id: 3, title: "Hanuman Ansh", genre: "Devotional · Drama", language: "Hindi", rating: "Check listings", poster: "" },
  { id: 4, title: "Nayyi Navelli", genre: "Drama", language: "Hindi", rating: "Check listings", poster: "" },
  { id: 5, title: "Nakhrewaalii", genre: "Romance · Comedy", language: "Hindi", rating: "Check listings", poster: "" },
  { id: 6, title: "Pehla Pyaar Doosri Baar", genre: "Romance", language: "Hindi", rating: "Check listings", poster: "" },
  { id: 7, title: "Pyre", genre: "Drama", language: "Regional", rating: "Check listings", poster: "" },
  { id: 8, title: "Prahaar", genre: "Drama", language: "Hindi", rating: "Check listings", poster: "" },
  { id: 9, title: "Clayface", genre: "Horror", language: "English · Hindi", rating: "Check listings", poster: "" }
];

const cinemas = [
  "Vedant PVR",
  "Ashish Palace",
  "Sangam Palace"
];

const times = ["11:00 AM", "2:30 PM", "6:00 PM", "9:15 PM"];
const ticketPrice = 180;

let currentMovie = null;
let currentCinema = "";
let currentTime = "";
let selectedSeats = new Set();
const bookedSeats = {};

function loadMovies(filter = "") {
  const root = document.getElementById("movies");
  if (!root) return;

  root.innerHTML = "";

  const results = movies.filter(movie =>
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (!results.length) {
    root.innerHTML = '<p class="empty">No movies found.</p>';
    return;
  }

  results.forEach(movie => {
    const card = document.createElement("article");
    card.className = "movie";

    const poster = document.createElement("img");
    poster.className = "poster";
    poster.alt = movie.title + " poster";
    poster.loading = "lazy";
    poster.src = movie.poster || cinemaPoster();

    poster.onerror = () => {
      poster.onerror = null;
      poster.src = cinemaPoster();
    };

    const info = document.createElement("div");
    info.className = "movie-info";

    const badge = document.createElement("span");
    badge.className = "pill";
    badge.textContent = "DEMO LISTING";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const details = document.createElement("div");
    details.className = "meta";
    details.textContent =
      movie.genre + " · " + movie.language + " · " + movie.rating;

    const button = document.createElement("button");
    button.className = "primary";
    button.textContent = "View Showtimes";
    button.addEventListener("click", () => openMovie(movie.id));

    info.append(badge, title, details, button);
    card.append(poster, info);
    root.appendChild(card);
  });
}

function cinemaPoster() {
  return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80";
}

function openMovie(id) {
  currentMovie = movies.find(movie => movie.id === id);
  if (!currentMovie) return;

  currentCinema = "";
  currentTime = "";
  selectedSeats.clear();

  document.getElementById("booking").classList.add("show");
  document.getElementById("booking-title").textContent = currentMovie.title;
  document.getElementById("booking-subtitle").textContent =
    "Fictional cinema listings for testing only.";

  document.getElementById("seat-area").classList.remove("show");

  document.getElementById("cinemas").innerHTML = cinemas.map((cinema, i) => `
    <div class="cinema">
      <div class="cinema-head">
        <span>${cinema}</span>
        <span class="muted">Demo screen ${i + 1}</span>
      </div>
      <div class="shows">
        ${times.map(time => `
          <button class="showtime"
            data-cinema="${cinema}"
            data-time="${time}">${time}</button>
        `).join("")}
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".showtime").forEach(button => {
    button.addEventListener("click", () => {
      chooseShow(button.dataset.cinema, button.dataset.time, button);
    });
  });

  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
}

function showKey() {
  return `${currentMovie.id}|${currentCinema}|${currentTime}`;
}

function chooseShow(cinema, time, button) {
  currentCinema = cinema;
  currentTime = time;
  selectedSeats.clear();

  document.querySelectorAll(".showtime").forEach(b => b.classList.remove("active"));
  button.classList.add("active");

  document.getElementById("seat-area").classList.add("show");
  document.getElementById("seat-heading").textContent = cinema + " · " + time;
  document.getElementById("seat-subheading").textContent =
    currentMovie.title + " · ₹" + ticketPrice + " per seat · Demo only";

  renderSeats();
}

function renderSeats() {
  const root = document.getElementById("seats");
  if (!root) return;

  root.innerHTML = "";
  const key = showKey();

  if (!bookedSeats[key]) {
    bookedSeats[key] = new Set(["A3", "B7", "C5", "D2", "E9", "F4"]);
  }

  for (const row of "ABCDEF") {
    for (let number = 1; number <= 10; number++) {
      const id = row + number;
      const seat = document.createElement("button");
      seat.className = "seat";
      seat.textContent = id;

      if (bookedSeats[key].has(id)) {
        seat.classList.add("booked");
        seat.textContent = "BOOKED";
        seat.disabled = true;
      } else {
        if (selectedSeats.has(id)) seat.classList.add("selected");

        seat.addEventListener("click", () => {
          if (selectedSeats.has(id)) selectedSeats.delete(id);
          else selectedSeats.add(id);
          renderSeats();
        });
      }

      root.appendChild(seat);
    }
  }

  updateSummary();
}

function updateSummary() {
  document.getElementById("selected-label").textContent =
    [...selectedSeats].sort().join(", ") || "No seats selected";

  document.getElementById("total").textContent =
    "₹" + selectedSeats.size * ticketPrice;
}

function confirmBooking() {
  if (!currentMovie || !currentCinema || !currentTime) {
    return showToast("Please select a cinema and showtime.");
  }

  if (!selectedSeats.size) {
    return showToast("Please select at least one available seat.");
  }

  const key = showKey();
  const seats = [...selectedSeats].sort();

  seats.forEach(seat => bookedSeats[key].add(seat));
  selectedSeats.clear();
  renderSeats();

  showToast("Demo booking confirmed: " + seats.join(", ") +
    " · Total ₹" + seats.length * ticketPrice);
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

  toastTimer = setTimeout(() => toast.classList.remove("show"), 4000);
}

const search = document.getElementById("search");
if (search) {
  search.addEventListener("input", e => loadMovies(e.target.value));
}

loadMovies();
