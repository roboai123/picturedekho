
const movies = [
  { id: 1, title: "Ramayana", genre: "Action · Adventure · Mythology", language: "Hindi · Tamil · Telugu", image: "banners/ramayana.jpg" },
  { id: 2, title: "Udta Teer", genre: "Action · Comedy", language: "Hindi", image: "banners/udta-teer.jpg" },
  { id: 3, title: "Rajini: The Jailer 2", genre: "Action · Thriller", language: "Hindi", image: "banners/jailer-2.jpg" },
  { id: 4, title: "Drishyam The Conclusion", genre: "Drama · Mystery · Thriller", language: "Hindi", image: "banners/drishyam-conclusion.jpg" },
  { id: 5, title: "The Vvaan - Force of the Forrest", genre: "Action · Adventure · Fantasy", language: "Hindi", image: "banners/vvaan.jpg" },
  { id: 6, title: "Hanuman Ansh", genre: "Devotional · Drama", language: "Hindi", image: "banners/hanuman-ansh.jpg" },
  { id: 7, title: "Nayyi Navelli", genre: "Drama", language: "Hindi", image: "banners/nayyi-navelli.jpg" },
  { id: 8, title: "Nakhrewaalii", genre: "Romance · Comedy", language: "Hindi", image: "banners/nakhrewaalii.jpg" },
  { id: 9, title: "Pehla Pyaar Doosri Baar", genre: "Romance", language: "Hindi", image: "banners/pehla-pyaar.jpg" },
  { id: 10, title: "Pyre", genre: "Drama", language: "Hindi", image: "banners/pyre.jpg" },
  { id: 11, title: "Prahaar", genre: "Drama · Biography", language: "Hindi", image: "banners/prahaar.jpg" },
  { id: 12, title: "Clayface", genre: "Horror", language: "English · Hindi", image: "banners/clayface.jpg" }
];

const cinemas = ["Vedant PVR", "Ashish Palace", "Sangam Palace"];
const times = ["11:00 AM", "2:30 PM", "6:00 PM", "9:15 PM"];
const ticketPrice = 180;

let activeMovie = movies[0];
let activeCinema = cinemas[0];
let activeTime = times[0];
let selectedSeats = [];
let bookedSeats = ["A3", "B7", "C5", "D2", "E9", "F4"];
let bannerIndex = 0;
let toastTimer;

const $ = id => document.getElementById(id);

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* ---------------- MOVIE CARDS ---------------- */

function renderMovies(filter = "") {
  const list = $("movies");
  list.innerHTML = "";

  const matchingMovies = movies.filter(movie =>
    (movie.title + " " + movie.genre + " " + movie.language)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  $("noResults").hidden = matchingMovies.length !== 0;

  matchingMovies.forEach(movie => {
    const card = document.createElement("article");
    card.className = "movie-card";

    const poster = document.createElement("div");
    poster.className = "movie-poster";

    const fallback = document.createElement("div");
    fallback.className = "poster-fallback";
    fallback.textContent = movie.title;
    poster.appendChild(fallback);

    const img = document.createElement("img");
    img.src = movie.image;
    img.alt = movie.title + " movie artwork";
    img.loading = "lazy";

    img.onload = () => {
      fallback.style.display = "none";
    };

    img.onerror = () => {
      img.style.display = "none";
      fallback.style.display = "flex";
    };

    poster.appendChild(img);

    const info = document.createElement("div");
    info.className = "movie-info";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const details = document.createElement("p");
    details.textContent = movie.genre + " · " + movie.language;

    const rating = document.createElement("div");
    rating.className = "movie-rating";
    rating.textContent = "Cinema listing";

    const button = document.createElement("button");
    button.className = "book-button";
    button.textContent = "Explore Shows";
    button.onclick = () => openBooking(movie);

    info.append(title, details, rating, button);
    card.append(poster, info);
    list.appendChild(card);
  });
}

$("search").addEventListener("input", event => {
  renderMovies(event.target.value);
});

/* ---------------- MOVIE BANNERS ---------------- */

function showBanner(index) {
  bannerIndex = (index + movies.length) % movies.length;

  const movie = movies[bannerIndex];
  const img = $("bannerImage");

  $("bannerTitle").textContent = movie.title;
  $("bannerDescription").textContent =
    movie.genre + " | " + movie.language;

  img.style.display = "block";
  img.src = movie.image;
  img.alt = movie.title + " movie banner";

  img.onerror = () => {
    img.style.display = "none";
  };

  const dots = $("bannerDots");
  [...dots.children].forEach((dot, i) => {
    dot.classList.toggle("active", i === bannerIndex);
  });
}

function createBannerDots() {
  const dots = $("bannerDots");
  dots.innerHTML = "";

  movies.forEach((movie, index) => {
    const dot = document.createElement("button");
    dot.className = "banner-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", "Show " + movie.title);
    dot.onclick = () => showBanner(index);
    dots.appendChild(dot);
  });
}

$("bannerPrev").addEventListener("click", () => {
  showBanner(bannerIndex - 1);
});

$("bannerNext").addEventListener("click", () => {
  showBanner(bannerIndex + 1);
});

$("bannerBook").addEventListener("click", () => {
  $("movies-section").scrollIntoView({ behavior: "smooth" });
});

createBannerDots();
showBanner(0);

setInterval(() => {
  if (!document.hidden) {
    showBanner(bannerIndex + 1);
  }
}, 6000);

/* ---------------- DEMO BOOKING ---------------- */

function openBooking(movie) {
  activeMovie = movie;
  activeCinema = cinemas[0];
  activeTime = times[0];
  selectedSeats = [];

  $("booking-title").textContent = movie.title;
  $("booking-subtitle").textContent =
    "Choose a cinema and showtime in Prayagraj.";

  $("booking").classList.add("show");
  $("seat-area").classList.add("show");

  renderCinemas();
  renderTimes();
  renderSeats();

  $("booking").scrollIntoView({ behavior: "smooth" });
}

$("closeBooking").addEventListener("click", () => {
  $("booking").classList.remove("show");
});

function renderCinemas() {
  const container = $("cinemas");
  container.innerHTML = "";

  cinemas.forEach(cinema => {
    const button = document.createElement("button");
    button.className = "cinema-option";
    button.textContent = cinema;

    if (cinema === activeCinema) {
      button.classList.add("active");
    }

    button.onclick = () => {
      activeCinema = cinema;
      selectedSeats = [];
      renderCinemas();
      renderSeats();
    };

    container.appendChild(button);
  });
}

function renderTimes() {
  const container = $("showtimes");
  container.innerHTML = "";

  times.forEach(time => {
    const button = document.createElement("button");
    button.className = "time-option";
    button.textContent = time;

    if (time === activeTime) {
      button.classList.add("active");
    }

    button.onclick = () => {
      activeTime = time;
      selectedSeats = [];
      renderTimes();
      renderSeats();
    };

    container.appendChild(button);
  });
}

function renderSeats() {
  const container = $("seats");
  container.innerHTML = "";

  const rows = ["A", "B", "C", "D", "E", "F"];

  rows.forEach(row => {
    for (let number = 1; number <= 10; number++) {
      const seatName = row + number;
      const button = document.createElement("button");

      button.type = "button";
      button.className = "seat";
      button.textContent = seatName;

      const isBooked = bookedSeats.includes(seatName);
      const isSelected = selectedSeats.includes(seatName);

      if (isBooked) {
        button.classList.add("booked");
        button.disabled = true;
        button.title = "Unavailable in this demo";
      } else if (isSelected) {
        button.classList.add("selected");
      }

      button.onclick = () => {
        if (selectedSeats.includes(seatName)) {
          selectedSeats = selectedSeats.filter(
            seat => seat !== seatName
          );
        } else {
          selectedSeats.push(seatName);
        }

        renderSeats();
      };

      container.appendChild(button);
    }
  });

  $("selected-label").textContent =
    selectedSeats.length ? selectedSeats.join(", ") : "None";

  $("total").textContent =
    "₹" + (selectedSeats.length * ticketPrice);
}

$("confirmBooking").addEventListener("click", () => {
  if (!selectedSeats.length) {
    showToast("Please select at least one seat.");
    return;
  }

  showToast(
    "Demo booking: " + selectedSeats.join(", ") +
    " · ₹" + (selectedSeats.length * ticketPrice)
  );

  // Demo only: seats are not saved to a database.
});

/* ---------------- INITIALISE ---------------- */

renderMovies();
