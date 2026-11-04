
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

/* ---------------- TICKET DESIGN ---------------- */

function installTicketDesign() {
  const style = document.createElement("style");

  style.textContent = `
    .pd-ticket-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-y: auto;
      background: rgba(0,0,0,.84);
      font-family: Arial, sans-serif;
    }

    .pd-ticket-overlay[hidden] {
      display: none !important;
    }

    .pd-ticket {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      max-width: 460px;
      margin: auto;
      padding: 26px;
      color: #171923;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 20px 70px #0008;
    }

    .pd-ticket * {
      box-sizing: border-box;
    }

    .pd-ticket-close {
      position: absolute;
      right: 14px;
      top: 12px;
      width: 34px;
      height: 34px;
      border: 0;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
    }

    .pd-ticket-logo {
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 800;
    }

    .pd-ticket-logo span {
      color: #e11d48;
    }

    .pd-ticket-status {
      display: inline-block;
      padding: 7px 10px;
      border-radius: 6px;
      color: #166534;
      background: #dcfce7;
      font-size: 11px;
      font-weight: 800;
    }

    .pd-ticket h2 {
      margin: 17px 0 6px;
      font-size: 27px;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }

    .pd-ticket-muted {
      margin: 0;
      color: #737373;
      font-size: 13px;
    }

    .pd-ticket-divider {
      margin: 21px 0;
      border-top: 1px dashed #c8c8c8;
    }

    .pd-ticket-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px 12px;
    }

    .pd-ticket-label {
      display: block;
      margin-bottom: 6px;
      color: #777;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .6px;
    }

    .pd-ticket-value {
      display: block;
      font-size: 14px;
      overflow-wrap: anywhere;
    }

    .pd-ticket-bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .pd-ticket-price {
      text-align: right;
    }

    .pd-ticket-price strong {
      color: #e11d48;
      font-size: 25px;
    }

    .pd-ticket-demo {
      margin: 10px 0 0;
      max-width: 220px;
      color: #a16207;
      font-size: 10px;
      font-weight: 800;
      line-height: 1.5;
    }

    .pd-ticket-qr {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 145px;
      margin-top: 20px;
    }

    .pd-ticket-qr img,
    .pd-ticket-qr canvas {
      max-width: 100%;
      height: auto;
    }

    .pd-ticket-qr-caption {
      margin: 8px 0 18px;
      color: #777;
      text-align: center;
      font-size: 11px;
    }

    .pd-ticket-actions {
      display: flex;
      gap: 10px;
    }

    .pd-ticket-actions button {
      flex: 1;
      padding: 12px;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
    }

    .pd-ticket-print {
      color: #fff;
      background: #e11d48;
    }

    .pd-ticket-close-bottom {
      color: #222;
      background: #eee;
    }

    @media(max-width:380px) {
      .pd-ticket {
        padding: 20px;
      }

      .pd-ticket h2 {
        font-size: 23px;
      }
    }

    @media print {
      body * {
        visibility: hidden !important;
      }

      .pd-ticket-overlay,
      .pd-ticket-overlay * {
        visibility: visible !important;
      }

      .pd-ticket-overlay {
        position: absolute;
        inset: 0;
        display: block !important;
        padding: 0;
        background: white;
        overflow: visible;
      }

      .pd-ticket {
        max-width: 100%;
        margin: 0 auto;
        box-shadow: none;
      }

      .pd-ticket-actions,
      .pd-ticket-close {
        display: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "pdTicketOverlay";
  overlay.className = "pd-ticket-overlay";
  overlay.hidden = true;

  overlay.innerHTML = `
    <section class="pd-ticket" role="dialog"
      aria-modal="true" aria-label="Your demo ticket">

      <button class="pd-ticket-close" id="pdCloseTicket"
        type="button" aria-label="Close ticket">×</button>

      <div class="pd-ticket-logo">🎬 Picture<span>Dekho</span></div>

      <span class="pd-ticket-status">✓ DEMO BOOKING CONFIRMED</span>

      <h2 id="pdTicketMovie">Movie title</h2>
      <p class="pd-ticket-muted">Your cinema experience awaits!</p>

      <div class="pd-ticket-divider"></div>

      <div class="pd-ticket-grid">
        <div>
          <span class="pd-ticket-label">CINEMA HALL</span>
          <strong class="pd-ticket-value" id="pdTicketCinema"></strong>
        </div>

        <div>
          <span class="pd-ticket-label">SHOWTIME</span>
          <strong class="pd-ticket-value" id="pdTicketTime"></strong>
        </div>

        <div>
          <span class="pd-ticket-label">DATE</span>
          <strong class="pd-ticket-value" id="pdTicketDate"></strong>
        </div>

        <div>
          <span class="pd-ticket-label">SEATS</span>
          <strong class="pd-ticket-value" id="pdTicketSeats"></strong>
        </div>
      </div>

      <div class="pd-ticket-divider"></div>

      <div class="pd-ticket-bottom">
        <div>
          <span class="pd-ticket-label">BOOKING ID</span>
          <strong class="pd-ticket-value" id="pdTicketId"></strong>
          <p class="pd-ticket-demo">
            DEMO ONLY — NOT VALID FOR REAL CINEMA ENTRY
          </p>
        </div>

        <div class="pd-ticket-price">
          <span class="pd-ticket-label">TOTAL</span>
          <strong id="pdTicketTotal"></strong>
        </div>
      </div>

      <div id="pdTicketQR" class="pd-ticket-qr"></div>
      <p class="pd-ticket-qr-caption">
        QR code contains your demo booking details
      </p>

      <div class="pd-ticket-actions">
        <button class="pd-ticket-print" id="pdPrintTicket" type="button">
          Print Ticket
        </button>
        <button class="pd-ticket-close-bottom" id="pdCloseTicket2" type="button">
          Close
        </button>
      </div>
    </section>
  `;

  document.body.appendChild(overlay);

  $("pdCloseTicket").addEventListener("click", closeTicket);
  $("pdCloseTicket2").addEventListener("click", closeTicket);

  $("pdPrintTicket").addEventListener("click", () => {
    window.print();
  });

  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeTicket();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeTicket();
  });
}

function closeTicket() {
  const overlay = $("pdTicketOverlay");
  if (overlay) overlay.hidden = true;
}

/* ---------------- QR CODE LIBRARY ---------------- */

let qrLibraryPromise = null;

function loadQRCodeLibrary() {
  if (window.QRCode) return Promise.resolve(true);
  if (qrLibraryPromise) return qrLibraryPromise;

  qrLibraryPromise = new Promise(resolve => {
    const script = document.createElement("script");

    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";

    script.onload = () => resolve(!!window.QRCode);
    script.onerror = () => resolve(false);

    document.head.appendChild(script);
  });

  return qrLibraryPromise;
}

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
      img.style.display = "flex";
      img.style.opacity = "0";
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
    rating.textContent = "Demo movie listing";

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

/* ---------------- FEATURED BANNERS ---------------- */

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
  if (!document.hidden) showBanner(bannerIndex + 1);
}, 6000);

/* ---------------- BOOKING PANEL ---------------- */

function openBooking(movie) {
  activeMovie = movie;
  activeCinema = cinemas[0];
  activeTime = times[0];
  selectedSeats = [];

  $("booking-title").textContent = movie.title;
  $("booking-subtitle").textContent =
    "Choose a demo cinema and showtime in Prayagraj.";

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

    if (cinema === activeCinema) button.classList.add("active");

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

    if (time === activeTime) button.classList.add("active");

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
    "₹" + selectedSeats.length * ticketPrice;
}

/* ---------------- CONFIRM DEMO BOOKING ---------------- */

async function confirmDemoBooking() {
  if (!selectedSeats.length) {
    showToast("Please select at least one seat.");
    return;
  }

  const seatsForTicket = [...selectedSeats];
  const bookingId = "PD" + Date.now().toString().slice(-8);

  const bookingDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const ticketData = {
    bookingId,
    movie: activeMovie.title,
    cinema: activeCinema,
    showtime: activeTime,
    date: bookingDate,
    seats: seatsForTicket,
    total: seatsForTicket.length * ticketPrice
  };

  $("pdTicketMovie").textContent = ticketData.movie;
  $("pdTicketCinema").textContent = ticketData.cinema;
  $("pdTicketTime").textContent = ticketData.showtime;
  $("pdTicketDate").textContent = ticketData.date;
  $("pdTicketSeats").textContent = ticketData.seats.join(", ");
  $("pdTicketId").textContent = ticketData.bookingId;
  $("pdTicketTotal").textContent = "₹" + ticketData.total;

  const qrContainer = $("pdTicketQR");
  qrContainer.innerHTML = "";

  $("pdTicketOverlay").hidden = false;

  const qrAvailable = await loadQRCodeLibrary();

  if (!$("pdTicketOverlay").hidden && qrAvailable && window.QRCode) {
    new QRCode(qrContainer, {
      text: JSON.stringify(ticketData),
      width: 140,
      height: 140,
      correctLevel: QRCode.CorrectLevel.M
    });
  } else if (!qrAvailable) {
    qrContainer.textContent =
      "QR code unavailable. Check your internet connection and try again.";
  }

  seatsForTicket.forEach(seat => {
    if (!bookedSeats.includes(seat)) bookedSeats.push(seat);
  });

  selectedSeats = [];
  renderSeats();
}

$("confirmBooking").addEventListener("click", confirmDemoBooking);

/* ---------------- START WEBSITE ---------------- */

installTicketDesign();
renderMovies();
