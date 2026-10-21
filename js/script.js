const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const status = carousel.querySelector("[data-carousel-status]");
  let statusTimer;

  const getSlideOffset = (slide) => {
    const slideLeft = slide.getBoundingClientRect().left;
    const viewportLeft = viewport.getBoundingClientRect().left;
    return viewport.scrollLeft + slideLeft - viewportLeft;
  };

  const getCurrentIndex = () => {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const availableSlides = slides.filter(
      (slide) => getSlideOffset(slide) <= maxScroll + 1,
    );
    let closestIndex = 0;
    let closestDistance = Infinity;

    availableSlides.forEach((slide) => {
      const index = slides.indexOf(slide);
      const distance = Math.abs(getSlideOffset(slide) - viewport.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const updateStatus = () => {
    const index = getCurrentIndex();
    status.textContent = `Serviço ${index + 1} de ${slides.length}`;
  };

  const showSlide = (index) => {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const availableSlides = slides.filter(
      (slide) => getSlideOffset(slide) <= maxScroll + 1,
    );
    const wrappedIndex =
      (index + availableSlides.length) % availableSlides.length;
    const slideIndex = slides.indexOf(availableSlides[wrappedIndex]);
    viewport.scrollTo({
      left: getSlideOffset(slides[slideIndex]),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    updateStatus();
  };

  previousButton.addEventListener("click", () => {
    showSlide(getCurrentIndex() - 1);
  });

  nextButton.addEventListener("click", () => {
    showSlide(getCurrentIndex() + 1);
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(getCurrentIndex() - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(getCurrentIndex() + 1);
    }
  });

  viewport.addEventListener("scroll", () => {
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(updateStatus, 100);
  });

  updateStatus();
}