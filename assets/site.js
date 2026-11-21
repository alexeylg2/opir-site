// A click on a screenshot shows it at its full size: on the page a window is drawn at half its width or less,
// and the text in it is too small to read. No library: the browser's own <dialog>.
(() => {
  const words = {
    uk: { open: "Збільшити зображення", close: "Закрити" },
    ru: { open: "Увеличить изображение", close: "Закрыть" },
    en: { open: "Enlarge the picture", close: "Close" },
  }[document.documentElement.lang] || { open: "Enlarge", close: "Close" };

  const pictures = document.querySelectorAll(".window img, .shot img, .chat img");
  if (!pictures.length || !window.HTMLDialogElement) return;

  const dialog = document.createElement("dialog");
  dialog.className = "zoom";
  dialog.innerHTML = `<button type="button" aria-label="${words.close}">×</button><img alt="">`;
  document.body.append(dialog);
  const large = dialog.querySelector("img");

  // Anywhere but the picture closes it; so does Esc, which <dialog> handles by itself.
  dialog.addEventListener("click", (event) => { if (event.target !== large) dialog.close(); });

  for (const picture of pictures) {
    picture.tabIndex = 0;
    picture.setAttribute("role", "button");
    picture.setAttribute("aria-label", `${words.open}: ${picture.alt}`);
    const show = () => {
      large.src = picture.currentSrc || picture.src;
      large.alt = picture.alt;
      dialog.showModal();
    };
    picture.addEventListener("click", show);
    picture.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); show(); }
    });
  }
})();
