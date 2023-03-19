const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster; //if there is no poster make it empty
    return `
    <img src='${imgSrc}'/>
    ${movie.Title} (${movie.Year})
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "88135cea",
        s: searchTerm,
      },
    });
    if (response.data.Error) {
      // if you write wrong movie name or not exist in the api not to return an error
      return [];
    }
    return response.data.Search;
  },
};
creatAutoComplete({
  ...autoCompleteConfig, //to not repeat the code twice.
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    return onMovieSelect(
      movie,
      document.querySelector("#left-summary"),
      "left"
    );
  },
});
creatAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    return onMovieSelect(
      movie,
      document.querySelector("#right-summary"),
      "right"
    );
  },
});
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElemnt, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "88135cea",
      i: movie.imdbID,
    },
  });
  summaryElemnt.innerHTML = movieTemplate(response.data);
  // console.log(response.data);
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    runComparison();
  }
};
const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index]; //to bring the same items by index number in right hand side
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);
    if (leftSideValue > rightSideValue) {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    } else {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    }
  });
};
const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );

  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const year = parseInt(movieDetail.Year);
  return `
  <article calss='media'>
 <figure class='media-left'>
 <p class='image'>
 <img src='${movieDetail.Poster}'/>
 </p>
 </figure>
 <div class='media-content'>
 <div class='content'>
 <h1>${movieDetail.Title}</h1>
 <h4>${movieDetail.Genre}</h4>
 <p>${movieDetail.Plot}</p>
 </div>
 </div>
 </article>
 <article data-value=${awards} class='notification is-primary'>
 <p class='title'>${movieDetail.Awards}</p>
 <p class='subtitle'>Awards</p>
 </article>
 <article data-value=${dollars} class='notification is-primary'>
 <p class='title'>${movieDetail.BoxOffice}</p>
 <p class='subtitle'>Box Office</p>
 </article>
 <article data-value=${metaScore} class='notification is-primary'>
 <p class='title'>${movieDetail.Metascore}</p>
 <p class='subtitle'>Metascore</p>
 </article>
 <article data-value=${imdbRating} class='notification is-primary'>
 <p class='title'>${movieDetail.imdbRating}</p>
 <p class='subtitle'>IMDB Rating</p>
 </article>
 <article data-value=${imdbVotes} class='notification is-primary'>
 <p class='title'>${movieDetail.imdbVotes}</p>
 <p class='subtitle'>IMDB Votes</p>
 </article>
 <article data-value= ${year} class='notification is-primary'>
 <p class='title'>${movieDetail.Year}</p>
 <p class='subtitle'>Year</p>
 </article>
`;
};
