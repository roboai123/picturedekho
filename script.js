
/* =========================================
   PICTUREDEKHO - COMPLETE JAVASCRIPT
   Movie banners, movie cards and demo booking
   ========================================= */

const movies = [
  {
    id: 1,
    title: "Ramayana",
    genre: "Action · Adventure · Mythology",
    language: "Hindi · Tamil · Telugu",
    image: "banners/ramayana.webp"
  },
  {
    id: 2,
    title: "Udta Teer",
    genre: "Action · Comedy",
    language: "Hindi",
    image: "banners/udta-teer.webp"
  },
  {
    id: 3,
    title: "Rajini: The Jailer 2",
    genre: "Action · Thriller",
    language: "Hindi",
    image: "banners/jailer-2.webp"
  },
  {
    id: 4,
    title: "Drishyam The Conclusion",
    genre: "Drama · Mystery · Thriller",
    language: "Hindi",
    image: "banners/drishyam-conclusion.webp"
  },
  {
    id: 5,
    title: "The Vvaan - Force of the Forrest",
    genre: "Action · Adventure · Fantasy",
    language: "Hindi",
    image: "banners/the-vvaan.webp"
  },
  {
    id: 6,
    title: "Hanuman Ansh",
    genre: "Devotional · Drama",
    language: "Hindi",
    image: "banners/hanuman-ansh.webp"
  },
  {
    id: 7,
    title: "Nayyi Navelli",
    genre: "Drama",
    language: "Hindi",
    image: "banners/nayyi-navelli.webp"
  },
  {
    id: 8,
    title: "Nakhrewaalii",
    genre: "Romance · Comedy",
    language: "Hindi",
    image: "banners/nakhrewaalii.webp"
  },
  {
    id: 9,
    title: "Pehla Pyaar Doosri Baar",
    genre: "Romance",
    language: "Hindi",
    image: "banners/pehla-pyaar.webp"
  },
  {
    id: 10,
    title: "Pyre",
    genre: "Drama",
    language: "Hindi",
    image: "banners/pyre.webp"
  },
  {
    id: 11,
    title: "Prahaar",
    genre: "Drama · Biography",
    language: "Hindi",
    image: "banners/prahaar.webp"
  },
  {
    id: 12,
    title: "Clayface",
    genre: "Horror",
    language: "English · Hindi",
    image: "banners/clayface.webp"
  }
];

/* =========================================
   DEMO CINEMAS AND SHOWTIMES
   ========================================= */

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

let activeMovie = movies[0];
let activeCinema = cinemas[0];
let activeTime = times[0];
let selectedSeats = [];
let bookedSeats = ["A3", "B7", "C5", "D2", "E9", "F4"];
let bannerIndex = 0;
let toastTimer;

const $ = id => document.getElementById(id);

/* =========================================
   NOTIFICATION
   ========================================= */

function showToast(message) {
  let toast = $("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* =========================================
   MOVIE CARDS AND POSTERS
   ========================================= */

function renderMovies(filter = "") {
  const list = $("movies");

  if (!list) {
    console.error('Missing HTML element: id="movies"');
    return;
  }

  list.innerHTML = "";

  const matchingMovies = movies.filter(movie =>
    (
      movie.title + " " +
      movie.genre + " " +
      movie.language
    ).toLowerCase().includes(filter.toLowerCase())
  );

  const noResults = $("noResults");

  if (noResults) {
    noResults.hidden = matchingMovies.length > 0;
  }

  matchingMovies.forEach(movie => {
    const card = document.createElement("article");
    card.className = "movie-card";

    const poster = document.createElement("div");
    poster.className = "movie-poster";

    const fallback = document.createElement("div");
    fallback.className = "poster-fallback";
    fallback.textContent = movie.title;

    const img = document.createElement("img");
    img.src = movie.image;
    img.alt = movie.title + " poster";
    img.loading = "lazy";

    img.onerror = () => {
      img.style.display = "none";
      fallback.style.display = "flex";
      console.error("Poster not found:", movie.image);
    };

    img.onload = () => {
      fallback.style.display = "none";
    };

    poster.append(fallback, img);

    const info = document.createElement("div");
    info.className = "movie-info";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const details = document.createElement("p");
    details.textContent =
      movie.genre + " · " + movie.language;

    const listing = document.createElement("div");
    listing.className = "movie-rating";
    listing.textContent = "Demo movie listing";

    const button = document.createElement("button");
    button.className = "book-button";
    button.type = "button";
    button.textContent = "Book Ticket";

    button.addEventListener("click", () => {
      openBooking(movie);
    });

    info.append(title, details, listing, button);
    card.append(poster, info);
    list.appendChild(card);
  });
}

/* =========================================
   SEARCH MOVIES
   ========================================= */

if ($("search")) {
  $("search").addEventListener("input", event => {
    renderMovies(event.target.value);
  });
}

/* =========================================
   TOP MOVIE BANNER
   ========================================= */

function showBanner(index) {
  bannerIndex = (index + movies.length) % movies.length;

  const movie = movies[bannerIndex];

  if ($("bannerTitle")) {
    $("bannerTitle").textContent = movie.title;
  }

  if ($("bannerDescription")) {
    $("bannerDescription").textContent =
      movie.genre + " | " + movie.language;
  }

  const img = $("bannerImage");

  if (img) {
    img.style.display = "block";
    img.src = movie.image;
    img.alt = movie.title + " banner";

    img.onerror = () => {
      img.style.display = "none";
      console.error("Banner image not found:", movie.image);
    };
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

    dot.addEventListener("click", () => {
      showBanner(index);
    });

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
  $("bannerBook").addEventListener("click", () => {
    const section = $("movies-section") || $("movies");

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  });
}

createBannerDots();
showBanner(0);

setInterval(() => {
  if (!document.hidden) {
    showBanner(bannerIndex + 1);
  }
}, 6000);

/* =========================================
   OPEN BOOKING
   ========================================= */

function openBooking(movie) {
  activeMovie = movie;
  activeCinema = cinemas[0];
  activeTime = times[0];
  selectedSeats = [];

  if ($("booking-title")) {
    $("booking-title").textContent = movie.title;
  }

  if ($("booking-subtitle")) {
    $("booking-subtitle").textContent =
      "Choose your demo cinema and showtime in Prayagraj.";
  }

  if ($("booking")) {
    $("booking").classList.add("show");
  }

  if ($("seat-area")) {
    $("seat-area").classList.add("show");
  }

  renderCinemas();
  renderTimes();
  renderSeats();

  if ($("booking")) {
    $("booking").scrollIntoView({ behavior: "smooth" });
  }
}

if ($("closeBooking")) {
  $("closeBooking").addEventListener("click", () => {
    if ($("booking")) {
      $("booking").classList.remove("show");
    }

    if ($("seat-area")) {
      $("seat-area").classList.remove("show");
    }
  });
}

/* =========================================
   CINEMA SELECTION
   ========================================= */

function renderCinemas() {
  const container = $("cinemas");

  if (!container) return;

  container.innerHTML = "";

  cinemas.forEach(cinema => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "cinema-option";
    button.textContent = cinema;

    if (cinema === activeCinema) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      activeCinema = cinema;
      selectedSeats = [];

      renderCinemas();
      renderSeats();
    });

    container.appendChild(button);
  });
}

/* =========================================
   SHOWTIME SELECTION
   ========================================= */

function renderTimes() {
  const container = $("showtimes");

  if (!container) return;

  container.innerHTML = "";

  times.forEach(time => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "time-option";
    button.textContent = time;

    if (time === activeTime) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      activeTime = time;
      selectedSeats = [];

      renderTimes();
      renderSeats();
    });

    container.appendChild(button);
  });
}

/* =========================================
   SEAT SELECTION
   ========================================= */

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
        if (selectedSeats.includes(seatName)) {
          selectedSeats = selectedSeats.filter(
            seat => seat !== seatName
          );
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
      selectedSeats.length
        ? selectedSeats.join(", ")
        : "None";
  }

  if ($("total")) {
    $("total").textContent =
      "₹" + selectedSeats.length * ticketPrice;
  }
}

/* =========================================
   DEMO TICKET WITH QR CODE
   ========================================= */

function createTicket(booking) {
  let modal = $("ticketModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "ticketModal";

    modal.style.cssText = `
      position:fixed;
      inset:0;
      z-index:99999;
      background:rgba(0,0,0,.82);
      display:none;
      align-items:center;
      justify-content:center;
      padding:16px;
      overflow:auto;
    `;

    document.body.appendChild(modal);
  }

  const qrData = [
    "PICTUREDEKHO DEMO TICKET",
    "Booking ID: " + booking.id,
    "Movie: " + booking.movie,
    "Cinema: " + booking.cinema,
    "Showtime: " + booking.time,
    "Date: " + booking.date,
    "Seats: " + booking.seats.join(", "),
    "Total: ₹" + booking.total,
    "DEMO ONLY - NOT VALID FOR REAL CINEMA ENTRY"
  ].join("\n");

  const qrURL =
    "https://api.qrserver.com/v1/create-qr-code/" +
    "?size=220x220&data=" + encodeURIComponent(qrData);

  modal.innerHTML = `
    <div id="ticketCard" style="
      width:100%;
      max-width:460px;
      background:#fff;
      color:#171717;
      border-radius:18px;
      padding:26px;
      box-sizing:border-box;
      font-family:Arial,sans-serif;
      max-height:95vh;
      overflow:auto;
    ">
      <div style="
        display:inline-block;
        padding:7px 10px;
        background:#d9fbe8;
        color:#087443;
        font-size:12px;
        font-weight:bold;
        border-radius:5px;
      ">
        ✓ DEMO BOOKING CONFIRMED
      </div>

      <h2 style="margin:15px 0 5px;font-size:25px;">
        ${escapeHTML(booking.movie)}
      </h2>

      <p style="margin:0 0 20px;color:#777;">
        Your cinema experience awaits!
      </p>

      <div style="
        border-top:1px dashed #bbb;
        border-bottom:1px dashed #bbb;
        padding:18px 0;
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:22px 12px;
      ">
        <div>
          <small style="color:#777;">CINEMA HALL</small>
          <div style="font-weight:bold;margin-top:5px;">
            ${escapeHTML(booking.cinema)}
          </div>
        </div>

        <div>
          <small style="color:#777;">SHOWTIME</small>
          <div style="font-weight:bold;margin-top:5px;">
            ${escapeHTML(booking.time)}
          </div>
        </div>

        <div>
          <small style="color:#777;">DATE</small>
          <div style="font-weight:bold;margin-top:5px;">
            ${escapeHTML(booking.date)}
          </div>
        </div>

        <div>
          <small style="color:#777;">SEATS</small>
          <div style="font-weight:bold;margin-top:5px;">
            ${escapeHTML(booking.seats.join(", "))}
          </div>
        </div>
      </div>

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:start;
        gap:12px;
        margin-top:20px;
      ">
        <div>
          <small style="color:#777;">BOOKING ID</small>
          <div style="font-weight:bold;margin-top:5px;">
            ${escapeHTML(booking.id)}
          </div>
        </div>

        <div style="text-align:right;">
          <small style="color:#777;">TOTAL</small>
          <div style="
            color:#e91e4d;
            font-size:25px;
            font-weight:bold;
            margin-top:4px;
          ">
            ₹${booking.total}
          </div>
        </div>
      </div>

      <p style="
        color:#a85b00;
        font-size:11px;
        font-weight:bold;
        line-height:1.5;
        margin-top:16px;
      ">
        DEMO ONLY — NOT VALID FOR REAL CINEMA ENTRY
      </p>

      <div style="text-align:center;margin:22px 0 8px;">
        <img
          src="${qrURL}"
          alt="Demo booking QR code"
          style="width:180px;height:180px;max-width:100%;"
        >

        <p style="font-size:11px;color:#777;">
          QR code contains your demo booking details.
        </p>
      </div>

      <div class="ticket-actions" style="
        display:flex;
        gap:10px;
        margin-top:18px;
      ">
        <button id="printTicket" type="button" style="
          flex:1;
          border:0;
          border-radius:8px;
          padding:13px 8px;
          background:#e91e4d;
          color:white;
          font-weight:bold;
          cursor:pointer;
        ">Print Ticket</button>

        <button id="closeTicket" type="button" style="
          flex:1;
          border:0;
          border-radius:8px;
          padding:13px 8px;
          background:#eee;
          color:#111;
          font-weight:bold;
          cursor:pointer;
        ">Close</button>
      </div>
    </div>
  `;

  modal.style.display = "flex";

  $("closeTicket").addEventListener("click", () => {
    modal.style.display = "none";
  });

  $("printTicket").addEventListener("click", () => {
    printDemoTicket();
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function printDemoTicket() {
  const ticket = $("ticketCard");

  if (!ticket) return;

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    showToast("Please allow pop-ups to print the ticket.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PictureDekho Demo Ticket</title>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #171717;
        }
        #ticketCard {
          max-width: 460px;
          margin: auto;
        }
        button {
          display: none !important;
        }
        img {
          object-fit: contain;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      ${ticket.outerHTML}
      <script>
        window.onload = function () {
          setTimeout(function () {
            window.print();
          }, 700);
        };
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/* =========================================
   CONFIRM DEMO BOOKING
   ========================================= */

if ($("confirmBooking")) {
  $("confirmBooking").addEventListener("click", () => {
    if (!selectedSeats.length) {
      showToast("Please select at least one seat.");
      return;
    }

    const booking = {
      id: "PD" + Date.now().toString().slice(-8),
      movie: activeMovie.title,
      cinema: activeCinema,
      time: activeTime,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata"
      }),
      seats: [...selectedSeats],
      total: selectedSeats.length * ticketPrice
    };

    // Mark seats as booked for this page session.
    bookedSeats.push(...selectedSeats);

    // Display the demo ticket and QR code.
    createTicket(booking);

    selectedSeats = [];
    renderSeats();
  });
}

/* =========================================
   INITIALISE WEBSITE
   ========================================= */

renderMovies();

console.log("PictureDekho loaded:", movies.length, "movie listings.");
