/* Watch Page Query */
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

/* Watch Player Mount */
const wrap = document.getElementById("playerWrap");

wrap.innerHTML = `
  <iframe
    src="https://www.youtube.com/embed/${id}?autoplay=1"
    allow="autoplay; encrypted-media"
    allowfullscreen>
  </iframe>
`;
