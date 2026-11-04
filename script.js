
const movies = [
  { title: "Ramayana", genre: "Action · Adventure · Mythology", language: "Hindi · Tamil · Telugu", image: "banners/ramayana.jpg" },
  { title: "Udta Teer", genre: "Action · Comedy", language: "Hindi", image: "banners/udta-teer.jpg" },
  { title: "Rajini: The Jailer 2", genre: "Action · Thriller", language: "Hindi", image: "banners/jailer-2.jpg" },
  { title: "Drishyam The Conclusion", genre: "Drama · Mystery · Thriller", language: "Hindi", image: "banners/drishyam-conclusion.jpg" },
  { title: "The Vvaan - Force of the Forrest", genre: "Action · Adventure · Fantasy", language: "Hindi", image: "banners/vvaan.jpg" },
  { title: "Hanuman Ansh", genre: "Devotional · Drama", language: "Hindi", image: "banners/hanuman-ansh.jpg" },
  { title: "Nayyi Navelli", genre: "Drama", language: "Hindi", image: "banners/nayyi-navelli.jpg" },
  { title: "Nakhrewaalii", genre: "Romance · Comedy", language: "Hindi", image: "banners/nakhrewaalii.jpg" },
  { title: "Pehla Pyaar Doosri Baar", genre: "Romance", language: "Hindi", image: "banners/pehla-pyaar.jpg" },
  { title: "Pyre", genre: "Drama", language: "Hindi", image: "banners/pyre.jpg" },
  { title: "Prahaar", genre: "Drama · Biography", language: "Hindi", image: "banners/prahaar.jpg" },
  { title: "Clayface", genre: "Horror", language: "English · Hindi", image: "banners/clayface.jpg" }
];

function renderMovies(filter = "") {
  const list = document.getElementById("movies");
  if (!list) return;

  list.replaceChildren();

  const results = movies.filter(movie =>
    (movie.title + " " + movie.genre + " " + movie.language)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const noResults = document.getElementById("noResults");
  if (noResults) noResults.hidden = results.length > 0;

  results.forEach(movie => {
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
    details.textContent = movie.genre + " · " + movie.language;

    const rating = document.createElement("div");
    rating.className = "movie-rating";
    rating.textContent = "Demo movie listing";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "book-button";
    button.textContent = "Book Ticket";

    button.addEventListener("click", () => {
      document.getElementById("booking-title").textContent = movie.title;
      document.getElementById("booking-subtitle").textContent =
        "Choose a cinema and showtime in Prayagraj.";

      document.getElementById("booking").classList.add("show");
      document.getElementById("seat-area").classList.add("show");
      document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    });

    info.append(title, details, rating, button);
    card.append(poster, info);
    list.appendChild(card);
  });
}

const search = document.getElementById("search");
if (search) {
  search.addEventListener("input", () => renderMovies(search.value));
}

renderMovies();
