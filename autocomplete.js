const creatAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
<label><b>Search</b></label>
<input class='input'/>
<div class= 'dropdown'>
    <div class='dropdown-menu'>
        <div class='dropdown-content results'></div>
    </div>
</div>
`;
  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");
  const Oninput = async (event) => {
    const items = await fetchData(event.target.value);

    if (!items.length) {
      //if you already made a search and then deleted it but the dropdown menu still active
      dropdown.classList.remove("is-active");
      return;
    }
    resultsWrapper.innerHTML = ""; //to delete all previous results not to stack them over each other
    dropdown.classList.add("is-active");

    for (let item of items) {
      const option = document.createElement("a");
      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active"); // to remove dropdown menu once you choose one
        input.value = inputValue(item); // to replace what you written with the orignal movie name
        onOptionSelect(item);
      });
      resultsWrapper.appendChild(option);
    }
  };
  input.addEventListener("input", deBounce(Oninput, 500));
  document.addEventListener("click", (event) => {
    // to remove the dropdown menu when you click outside your search area
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
