const FontFaceObserver = require("fontfaceobserver");

// This is to support loading external fonts without having it break on initial render
// https://github.com/zeit/next.js/issues/512#issuecomment-322026199

const LoadFonts = () => {
  const fonts = {
    "Gentium Book Basic":
      "https://fonts.googleapis.com/css?family=Gentium+Book+Basic:400,400i,700,700i",
    Dosis: "https://fonts.googleapis.com/css?family=Dosis:500"
  };

  const loadedFonts = Object.entries(fonts).map(([name, url]) => {
    const link = document.createElement("link");
    link.href = url;
    link.rel = "stylesheet";

    document.head.appendChild(link);

    return new FontFaceObserver(name).load().then(() => name);
  });

  Promise.all(loadedFonts)
    .then(loaded => {
      document.documentElement.classList.add("fonts-loaded");
    })
    .catch(() => {
      document.documentElement.classList.add("fonts-failed");
    });
};

export default LoadFonts;
