
const movies = [
  { id: 1, title: "Ramayana", genre: "Action · Adventure · Mythology", language: "Hindi · Tamil · Telugu", image: "banners/ramayana.webp", fallback: "ramayana.webp" },
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
let bookingCounter = 1000;

const $ = id => document.getElementById(id);

/* ---------------- NOTIFICATIONS ---------------- */

function showToast(message) {
  const toast = $("toast");
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* ---------------- IMAGE HANDLING ---------------- */

function setMovieImage(img, movie) {
  img.alt = movie.title + " movie poster";
  img.loading = "lazy";

  img.onerror = function () {
    if (movie.fallback && img.dataset.fallback !== "used") {
      img.dataset.fallback = "used";
      img.src = movie.fallback;
      return;
    }

    img.style.display = "none";

    if (img.parentElement) {
      const fallback = img.parentElement.querySelector(".poster-fallback");
      if (fallback) fallback.style.display = "flex";
    }
  };

  img.src = movie.image;
}

/* ---------------- MOVIE CARDS ---------------- */

function renderMovies(filter = "") {
  const list = $("movies");
  if (!list) return;

  list.innerHTML = "";

  const matchingMovies = movies.filter(movie =>
    (movie.title + " " + movie.genre + " " + movie.language)
      .toLowerCase()
      .includes(filter.trim().toLowerCase())
  );

  const noResults = $("noResults");
  if (noResults) noResults.hidden = matchingMovies.length > 0;

  matchingMovies.forEach(movie => {
    const card = document.createElement("article");
    card.className = "movie-card";

    const poster = document.createElement("div");
    poster.className = "movie-poster";

    const fallback = document.createElement("div");
    fallback.className = "poster-fallback";
    fallback.textContent = movie.title;
    fallback.style.cssText =
      "display:flex;align-items:center;justify-content:center;" +
      "text-align:center;padding:15px;box-sizing:border-box;" +
      "width:100%;height:100%;background:#252532;color:#fff;";

    const img = document.createElement("img");
    setMovieImage(img, movie);
    poster.append(fallback, img);

    const info = document.createElement("div");
    info.className = "movie-info";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const details = document.createElement("p");
    details.textContent = movie.genre + " · " + movie.language;

    const rating = document.createElement("div");
    rating.className = "movie-rating";
    rating.textContent = "Demo movie listing";

    const button = document.createElement("button");
    button.className = "book-button";
    button.type = "button";
    button.textContent = "Book Ticket";
    button.addEventListener("click", () => openBooking(movie));

    info.append(title, details, rating, button);
    card.append(poster, info);
    list.appendChild(card);
  });
}

/* ---------------- SEARCH ---------------- */

if ($("search")) {
  $("search").addEventListener("input", event => {
    renderMovies(event.target.value);
  });
}

/* ---------------- FEATURED BANNERS ---------------- */

function showBanner(index) {
  bannerIndex = (index + movies.length) % movies.length;
  const movie = movies[bannerIndex];

  const img = $("bannerImage");
  if (img) {
    img.style.display = "block";
    setMovieImage(img, movie);
    img.loading = "eager";
  }

  if ($("bannerTitle")) {
    $("bannerTitle").textContent = movie.title;
  }

  if ($("bannerDescription")) {
    $("bannerDescription").textContent =
      movie.genre + " | " + movie.language;
  }

  const dots = $("bannerDots");
  if (dots) {
    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === bannerIndex);
    });
  }
}

function createBannerDots() {
  const dots = $("bannerDots");
  if (!dots) return;

  dots.innerHTML = "";

  movies.forEach((movie, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "banner-dot";
    dot.setAttribute("aria-label", "Show " + movie.title);
    dot.addEventListener("click", () => showBanner(index));
    dots.appendChild(dot);
  });
}

if ($("bannerPrev")) {
  $("bannerPrev").addEventListener("click", () => {
    showBanner(bannerIndex - 1);
  });
}

if ($("bannerNext")) {
  $("bannerNext").addEventListener("click", () => {
    showBanner(bannerIndex + 1);
  });
}

if ($("bannerBook")) {
  $("bannerBook").textContent = "Book Ticket";
  $("bannerBook").addEventListener("click", () => {
    $("movies-section")?.scrollIntoView({ behavior: "smooth" });
  });
}

createBannerDots();
showBanner(0);

setInterval(() => {
  if (!document.hidden) showBanner(bannerIndex + 1);
}, 6000);

/* ---------------- STEP-BY-STEP BOOKING ---------------- */

function headingFor(elementId) {
  const element = $(elementId);
  return element ? element.previousElementSibling : null;
}

function showBookingStep(step) {
  const cinemaHeading = headingFor("cinemas");
  const timeHeading = headingFor("showtimes");

  if ($("cinemas")) $("cinemas").style.display = step >= 1 ? "flex" : "none";
  if (cinemaHeading) cinemaHeading.style.display = step >= 1 ? "" : "none";

  if ($("showtimes")) $("showtimes").style.display = step >= 2 ? "flex" : "none";
  if (timeHeading) timeHeading.style.display = step >= 2 ? "" : "none";

  if ($("seat-area")) {
    $("seat-area").classList.toggle("show", step >= 3);
  }
}

function openBooking(movie) {
  activeMovie = movie;
  activeCinema = "";
  activeTime = "";
  selectedSeats = [];

  if ($("booking-title")) $("booking-title").textContent = movie.title;
  if ($("booking-subtitle")) {
    $("booking-subtitle").textContent =
      "Step 1: Choose your cinema in Prayagraj.";
  }

  $("booking")?.classList.add("show");

  showBookingStep(1);
  renderCinemas();
  renderTimes();
  renderSeats();

  $("booking")?.scrollIntoView({ behavior: "smooth" });
}

if ($("closeBooking")) {
  $("closeBooking").addEventListener("click", () => {
    $("booking")?.classList.remove("show");
  });
}

/* ---------------- CINEMA SELECTION ---------------- */

function renderCinemas() {
  const container = $("cinemas");
  if (!container) return;

  container.innerHTML = "";

  cinemas.forEach(cinema => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cinema-option";
    button.textContent = cinema;

    if (cinema === activeCinema) button.classList.add("active");

    button.addEventListener("click", () => {
      activeCinema = cinema;
      activeTime = "";
      selectedSeats = [];

      if ($("booking-subtitle")) {
        $("booking-subtitle").textContent =
          "Step 2: Choose a showtime at " + cinema + ".";
      }

      renderCinemas();
      renderTimes();
      renderSeats();
      showBookingStep(2);
    });

    container.appendChild(button);
  });
}

/* ---------------- SHOWTIME SELECTION ---------------- */

function renderTimes() {
  const container = $("showtimes");
  if (!container) return;

  container.innerHTML = "";

  times.forEach(time => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "time-option";
    button.textContent = time;

    if (time === activeTime) button.classList.add("active");

    button.addEventListener("click", () => {
      activeTime = time;
      selectedSeats = [];

      if ($("booking-subtitle")) {
        $("booking-subtitle").textContent =
          "Step 3: Select seats for " + activeTime + ".";
      }

      renderTimes();
      renderSeats();
      showBookingStep(3);
    });

    container.appendChild(button);
  });
}

/* ---------------- SEAT SELECTION ---------------- */

function renderSeats() {
  const container = $("seats");
  if (!container) return;

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

      button.addEventListener("click", () => {
        if (!activeCinema || !activeTime) {
          showToast("Please choose a cinema and showtime first.");
          return;
        }

        if (selectedSeats.includes(seatName)) {
          selectedSeats = selectedSeats.filter(s => s !== seatName);
        } else {
          selectedSeats.push(seatName);
        }

        renderSeats();
      });

      container.appendChild(button);
    }
  });

  if ($("selected-label")) {
    $("selected-label").textContent =
      selectedSeats.length ? selectedSeats.join(", ") : "None";
  }

  if ($("total")) {
    $("total").textContent = "₹" + selectedSeats.length * ticketPrice;
  }
}

/* ---------------- QR LIBRARY ---------------- */

function loadQRCodeLibrary() {
  return new Promise((resolve, reject) => {
    if (window.QRCode) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[data-qrcode-library="yes"]');

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.dataset.qrcodeLibrary = "yes";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/* ---------------- DEMO TICKET ---------------- */

function showTicket() {
  const total = selectedSeats.length * ticketPrice;
  const bookingId =
    "PD" + Date.now().toString().slice(-7) + (++bookingCounter);

  const oldModal = $("ticketModal");
  if (oldModal) oldModal.remove();

  const modal = document.createElement("div");
  modal.id = "ticketModal";

  modal.style.cssText = `
    position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,.78);display:flex;
    align-items:center;justify-content:center;
    padding:12px;overflow:auto;
  `;

  const ticket = document.createElement("div");
  ticket.style.cssText = `
    width:100%;max-width:460px;max-height:95vh;overflow:auto;
    background:#fff;color:#171717;border-radius:18px;
    padding:26px;box-sizing:border-box;
    font-family:Arial,sans-serif;box-shadow:0 20px 70px #0008;
  `;

  const safe = value => String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[ch]));

  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });

  ticket.innerHTML = `
    <div style="display:inline-block;background:#d9fbe7;color:#087443;
      padding:7px 10px;border-radius:5px;font-size:12px;font-weight:bold">
      ✓ DEMO BOOKING CONFIRMED
    </div>

    <h1 style="font-size:26px;margin:18px 0 8px">
      ${safe(activeMovie.title)}
    </h1>

    <p style="color:#666;margin:0 0 22px">
      Your cinema experience awaits!
    </p>

    <div style="border-top:1px dashed #bbb;border-bottom:1px dashed #bbb;
      padding:18px 0;display:grid;grid-template-columns:1fr 1fr;gap:22px 12px">

      <div><small style="color:#777">CINEMA HALL</small>
        <div style="font-weight:bold;margin-top:5px">${safe(activeCinema)}</div>
      </div>

      <div><small style="color:#777">SHOWTIME</small>
        <div style="font-weight:bold;margin-top:5px">${safe(activeTime)}</div>
      </div>

      <div><small style="color:#777">DATE</small>
        <div style="font-weight:bold;margin-top:5px">${safe(date)}</div>
      </div>

      <div><small style="color:#777">SEATS</small>
        <div style="font-weight:bold;margin-top:5px">${safe(selectedSeats.join(", "))}</div>
      </div>

      <div><small style="color:#777">BOOKING ID</small>
        <div style="font-weight:bold;margin-top:5px">${safe(bookingId)}</div>
      </div>

      <div><small style="color:#777">TOTAL</small>
        <div style="font-size:24px;color:#e9164a;font-weight:bold;margin-top:3px">
          ₹${total}
        </div>
      </div>
    </div>

    <p style="font-size:11px;font-weight:bold;color:#b35a00;margin-top:14px">
      DEMO ONLY — NOT VALID FOR REAL CINEMA ENTRY
    </p>

    <div id="ticketQR" style="display:flex;justify-content:center;
      margin:20px auto 8px;min-height:30px"></div>

    <p style="font-size:12px;color:#777;text-align:center">
      QR code contains your demo booking details.
    </p>

    <div style="display:flex;gap:10px;margin-top:20px">
      <button id="printTicket" style="flex:1;background:#e9164a;color:#fff;
        border:0;border-radius:9px;padding:14px;font-size:15px;font-weight:bold;
        cursor:pointer">Print Ticket</button>

      <button id="closeTicket" style="flex:1;background:#eee;color:#111;
        border:0;border-radius:9px;padding:14px;font-size:15px;font-weight:bold;
        cursor:pointer">Close</button>
    </div>
  `;

  modal.appendChild(ticket);
  document.body.appendChild(modal);

  const qrDetails = [
    "PictureDekho DEMO TICKET",
    "Booking ID: " + bookingId,
    "Movie: " + activeMovie.title,
    "Cinema: " + activeCinema,
    "Showtime: " + activeTime,
    "Date: " + date,
    "Seats: " + selectedSeats.join(", "),
    "Total: INR " + total,
    "Demo only; not valid for real cinema entry."
  ].join("\n");

  loadQRCodeLibrary()
    .then(() => {
      const qrContainer = $("ticketQR");
      if (qrContainer && window.QRCode) {
        new window.QRCode(qrContainer, {
          text: qrDetails,
          width: 140,
          height: 140,
          correctLevel: window.QRCode.CorrectLevel.M
        });
      }
    })
    .catch(() => {
      const qrContainer = $("ticketQR");
      if (qrContainer) {
        qrContainer.textContent =
          "QR unavailable offline. Connect to the internet and reopen the ticket.";
        qrContainer.style.fontSize = "12px";
        qrContainer.style.textAlign = "center";
      }
    });

  $("closeTicket").addEventListener("click", () => modal.remove());

  $("printTicket").addEventListener("click", () => {
    window.print();
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) modal.remove();
  });
}

/* ---------------- CONFIRM BOOKING ---------------- */

if ($("confirmBooking")) {
  $("confirmBooking").textContent = "Confirm Demo Booking";

  $("confirmBooking").addEventListener("click", () => {
    if (!activeCinema) {
      showToast("Please choose a cinema first.");
      showBookingStep(1);
      return;
    }

    if (!activeTime) {
      showToast("Please choose a showtime first.");
      showBookingStep(2);
      return;
    }

    if (!selectedSeats.length) {
      showToast("Please select at least one seat.");
      return;
    }

    // Demo-only booking: this does not reserve real cinema seats.
    selectedSeats.forEach(seat => {
      if (!bookedSeats.includes(seat)) bookedSeats.push(seat);
    });

    showTicket();
    renderSeats();
  });
}

/* ---------------- INITIALISE ---------------- */

if ($("booking")) $("booking").classList.remove("show");
if ($("seat-area")) $("seat-area").classList.remove("show");

showBookingStep(0);
renderMovies();
