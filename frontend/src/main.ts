import './style.css'
import { apiUrl, clearAuthUser, getAuthUser, googleAuthUrl, isBackendAvailable } from './api'
import { connectPriceFeed } from './crypto'

const authUser = getAuthUser()

const googleIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285f4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 3-4.4 3-7.5Z"/>
    <path fill="#34a853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/>
    <path fill="#fbbc05" d="M6.5 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9.1L6.5 14Z"/>
    <path fill="#ea4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.8 9.8 0 0 0 3.1 7.5l3.4 2.6A5.9 5.9 0 0 1 12 6Z"/>
  </svg>
`

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="page">
    <a class="logo logo--fixed" href="#" aria-label="Kairos home"><img src="/assets/kairos.svg" alt="KAIROS"></a>
    <section class="hero">
      <video class="hero__video" autoplay loop muted playsinline aria-hidden="true">
        <source src="/assets/hero.mp4" type="video/mp4">
      </video>
      <div class="hero__shade"></div>

      <header class="header shell">
        <a class="logo logo--placeholder" href="#" aria-hidden="true" tabindex="-1"><img src="/assets/kairos.svg" alt=""></a>
        <nav class="nav" aria-label="Main navigation">
          <a href="#">Home</a>
          <a href="#about">About us</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact us</a>
        </nav>
        <button class="menu-button" type="button" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false"><span></span><span></span></button>
      </header>

      <div class="hero__content shell">
        <div class="hero__copy">
          <h1>From the<br>field of all<br>possibility</h1>
          <p>This is an emergent space where ideas are not created, but carefully discovered. We<br class="desktop-break"> navigate the vast potential to bring forth only the most resonant patterns and coherent<br class="desktop-break"> forms. Here, the future is curated from the infinite.</p>
          <div class="hero__actions">
            <button class="tiny-button" type="button" data-learn-open>
              <span class="tiny-button__label">Learn More</span>
              <span class="tiny-button__end tiny-button__end--arrow" aria-hidden="true">&rarr;</span>
            </button>
            <button class="tiny-button tiny-button--outline" type="button" data-video-open>
              <span class="tiny-button__label">Play Video</span>
              <span class="tiny-button__end tiny-button__end--play" aria-hidden="true"><i></i></span>
            </button>
          </div>
        </div>

        <aside class="bank-card" aria-label="Online banking sign in">
          <h2>Online banking</h2>
          <div class="bank-card__tabs" role="tablist" aria-label="Online banking access method">
            <button class="is-active" type="button" role="tab" aria-selected="true">Sign In</button>
            <button type="button" role="tab" aria-selected="false">Enter Email</button>
          </div>
          ${authUser ? `
            <div class="auth-profile">
              <img class="auth-profile__picture" alt="" referrerpolicy="no-referrer">
              <strong class="auth-profile__name"></strong>
              <span class="auth-profile__email"></span>
            </div>
            <button class="create-button auth-profile__sign-out" type="button" data-sign-out>Sign out</button>
          ` : `
            <a class="google-button" href="${googleAuthUrl}">${googleIcon}<span>Google</span></a>
            <p>Start Your Journey Now!</p>
            <div class="divider"><span>or</span></div>
            <button class="create-button" type="button">Create account</button>
          `}
          <span class="backend-status" data-backend-status aria-live="polite">Connecting to API...</span>
        </aside>
      </div>
    </section>

    <div class="menu-backdrop" data-menu-close></div>
    <aside class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <a class="mobile-menu__logo" href="#" data-menu-close><img src="/assets/kairos.svg" alt="KAIROS"></a>
      <button class="mobile-menu__close" type="button" aria-label="Close menu" data-menu-close>&times;</button>
      <nav aria-label="Mobile navigation">
        <a href="#" data-menu-close>Home</a>
        <a href="#about" data-menu-close>About us</a>
        <a href="#projects" data-menu-close>Projects</a>
        <a href="#contact" data-menu-close>Contact us</a>
      </nav>
    </aside>

    <div class="video-modal" id="video-modal" aria-hidden="true" role="dialog" aria-label="Kairos video">
      <button class="video-modal__backdrop" type="button" aria-label="Close video" data-video-close></button>
      <div class="video-modal__content">
        <button class="video-modal__close" type="button" aria-label="Close video" data-video-close>&times;</button>
        <video class="video-modal__player" src="/assets/hero.mp4" preload="metadata" playsinline controls aria-label="Kairos video"></video>
        <button class="video-modal__play" type="button" aria-label="Play video">&#9654;</button>
      </div>
    </div>

    <div class="learn-modal" id="learn-modal" aria-hidden="true" role="dialog" aria-label="Learn more about Kairos">
      <button class="learn-modal__backdrop" type="button" aria-label="Close article" data-learn-close></button>
      <article class="learn-modal__content">
        <button class="learn-modal__close" type="button" aria-label="Close article" data-learn-close>&times;</button>
        <h2>The digital bridge between reality and tomorrow</h2>
        <p>When you turn on your smart alarm clock in the morning of 2026, it already knows you slept seventeen minutes less than usual. The algorithm picks a morning playlist based on your heart rate and the current moon phase. Your voice assistant, trained on thousands of previous conversations, doesn't just say “good morning” — it reminds you: “Don't forget to pick up your package from the drone post before 10:30 am.” You step up to the mirror, and instead of your reflection, you see graphs of your hydration levels, your daily schedule, and a suggestion: “You might want to take extra vitamin D — it's going to be cloudy today.”</p>
        <p>In the evening, you activate “dark matter” mode at home: the lights dim gradually, following your movement; the Wi-Fi reallocates bandwidth to stream a movie in 32K; and the lounge chair warms up exactly the spot on your back that got tired from sitting. On screen — not just a film: a generative neural network adjusts the subtitles, replaces store signs with brands you recognize, and even redubs the actors if you whisper a request.</p>
        <p>When you turn on your smart alarm clock in the morning of 2026, it already knows you slept seventeen minutes less than usual. The algorithm picks a morning playlist based on your heart rate and the current moon phase.</p>
      </article>
    </div>

    <section class="products shell" id="projects">
      <svg class="dashboard-line dashboard-line--top-left" viewBox="0 0 474 220" aria-hidden="true">
        <path d="M6 214V80L120 6H468"></path>
        <circle cx="6" cy="214" r="6"></circle>
        <circle cx="468" cy="6" r="6"></circle>
      </svg>
      <i class="dashboard-line dashboard-line--top-right" aria-hidden="true"></i>
      <i class="dashboard-line dashboard-line--bottom-left" aria-hidden="true"></i>
      <svg class="dashboard-line dashboard-line--bottom-right" viewBox="0 0 613 286" aria-hidden="true">
        <path d="M6 280H286L388 184H541L607 102V6"></path>
        <circle cx="6" cy="280" r="6"></circle>
        <circle cx="607" cy="6" r="6"></circle>
      </svg>
      <div class="coin-list coin-list--left" id="coin-list-left"></div>
      <div class="portal">
        <div class="portal__ring portal__ring--one"></div>
        <div class="portal__ring portal__ring--two"></div>
        <div class="portal__ring portal__ring--three"></div>
        <div class="portal__orbiter" aria-hidden="true"></div>
        <div class="portal__center">
          <h2>Online banking</h2>
          <div class="crypto-picker">
            <button class="add-button" type="button" aria-expanded="false" aria-controls="crypto-options">
              <span class="add-button__selection">Add a Cryptocurrency</span>
              <b>&rsaquo;</b>
            </button>
            <div class="crypto-options" id="crypto-options" aria-hidden="true">
              <button type="button" data-coin="Binance Coin"><img src="/assets/coins/bnb.svg" alt="">Binance Coin</button>
              <button type="button" data-coin="Tether"><img src="/assets/coins/usdt.svg" alt="">Tether</button>
              <button type="button" data-coin="Solana"><img src="/assets/coins/sol.svg" alt="">Solana</button>
            </div>
          </div>
        </div>
      </div>
      <div class="coin-list coin-list--right" id="coin-list-right"></div>
    </section>
  </main>
`

connectPriceFeed()

const backendStatus = document.querySelector<HTMLElement>('[data-backend-status]')
const googleButton = document.querySelector<HTMLAnchorElement>('.google-button')

void isBackendAvailable().then((available) => {
  if (backendStatus) {
    backendStatus.textContent = available ? 'API connected' : `API unavailable: ${apiUrl}`
    backendStatus.classList.toggle('is-error', !available)
  }

  googleButton?.classList.toggle('is-disabled', !available)
  googleButton?.setAttribute('aria-disabled', String(!available))
})

if (authUser) {
  const profilePicture = document.querySelector<HTMLImageElement>('.auth-profile__picture')
  const profileName = document.querySelector<HTMLElement>('.auth-profile__name')
  const profileEmail = document.querySelector<HTMLElement>('.auth-profile__email')

  if (profilePicture && authUser.picture) profilePicture.src = authUser.picture
  if (profileName) profileName.textContent = authUser.name || 'Google user'
  if (profileEmail) profileEmail.textContent = authUser.email
}

document.querySelector('[data-sign-out]')?.addEventListener('click', () => {
  clearAuthUser()
  window.location.reload()
})

googleButton?.addEventListener('click', (event) => {
  if (googleButton.getAttribute('aria-disabled') === 'true') event.preventDefault()
})

const hero = document.querySelector<HTMLElement>('.hero')
const products = document.querySelector<HTMLElement>('.products')

requestAnimationFrame(() => hero?.classList.add('is-ready'))

if (products) {
  const productsObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry?.isIntersecting) return
    products.classList.add('is-visible')
    observer.disconnect()
  }, { threshold: 0.25 })

  productsObserver.observe(products)
}

const menuButton = document.querySelector<HTMLButtonElement>('.menu-button')
const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu')
const menuCloseElements = document.querySelectorAll<HTMLElement>('[data-menu-close]')
const bankTabs = document.querySelectorAll<HTMLButtonElement>('.bank-card__tabs button')

bankTabs.forEach((tab) => tab.addEventListener('click', () => {
  bankTabs.forEach((item) => {
    const active = item === tab
    item.classList.toggle('is-active', active)
    item.setAttribute('aria-selected', String(active))
  })
}))

function setMenu(open: boolean): void {
  document.body.classList.toggle('menu-open', open)
  menuButton?.setAttribute('aria-expanded', String(open))
  mobileMenu?.setAttribute('aria-hidden', String(!open))
}

menuButton?.addEventListener('click', () => setMenu(true))
menuCloseElements.forEach((element) => element.addEventListener('click', () => setMenu(false)))
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false)
})

const videoModal = document.querySelector<HTMLElement>('#video-modal')
const videoPlayer = document.querySelector<HTMLVideoElement>('.video-modal__player')
const videoOpenButton = document.querySelector<HTMLButtonElement>('[data-video-open]')
const videoCloseElements = document.querySelectorAll<HTMLElement>('[data-video-close]')
const videoPlayButton = document.querySelector<HTMLButtonElement>('.video-modal__play')

function setVideoModal(open: boolean): void {
  document.body.classList.toggle('video-open', open)
  videoModal?.setAttribute('aria-hidden', String(!open))
  if (!open && videoPlayer) {
    videoPlayer.pause()
    videoPlayer.currentTime = 0
  }
}

videoOpenButton?.addEventListener('click', () => setVideoModal(true))
videoCloseElements.forEach((element) => element.addEventListener('click', () => setVideoModal(false)))
videoPlayButton?.addEventListener('click', () => {
  void videoPlayer?.play()
})
videoPlayer?.addEventListener('click', () => {
  if (videoPlayer.paused) {
    void videoPlayer.play()
  } else {
    videoPlayer.pause()
  }
})
videoPlayer?.addEventListener('play', () => videoPlayButton?.classList.add('is-hidden'))
videoPlayer?.addEventListener('pause', () => videoPlayButton?.classList.remove('is-hidden'))
videoPlayer?.addEventListener('ended', () => videoPlayButton?.classList.remove('is-hidden'))
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setVideoModal(false)
})

const learnModal = document.querySelector<HTMLElement>('#learn-modal')
const learnOpenButton = document.querySelector<HTMLButtonElement>('[data-learn-open]')
const learnCloseElements = document.querySelectorAll<HTMLElement>('[data-learn-close]')

function setLearnModal(open: boolean): void {
  document.body.classList.toggle('learn-open', open)
  learnModal?.setAttribute('aria-hidden', String(!open))
}

learnOpenButton?.addEventListener('click', () => setLearnModal(true))
learnCloseElements.forEach((element) => element.addEventListener('click', () => setLearnModal(false)))
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setLearnModal(false)
})

const cryptoPicker = document.querySelector<HTMLElement>('.crypto-picker')
const addButton = document.querySelector<HTMLButtonElement>('.add-button')
const cryptoOptions = document.querySelector<HTMLElement>('.crypto-options')
const cryptoOptionButtons = document.querySelectorAll<HTMLButtonElement>('.crypto-options button')

function setCryptoPicker(open: boolean): void {
  cryptoPicker?.classList.toggle('is-open', open)
  addButton?.setAttribute('aria-expanded', String(open))
  cryptoOptions?.setAttribute('aria-hidden', String(!open))
}

addButton?.addEventListener('click', () => setCryptoPicker(!cryptoPicker?.classList.contains('is-open')))
cryptoOptionButtons.forEach((button) => button.addEventListener('click', () => {
  const selectedCoin = button.dataset.coin
  const selectedIcon = button.querySelector<HTMLImageElement>('img')
  const selection = addButton?.querySelector<HTMLElement>('.add-button__selection')

  cryptoOptionButtons.forEach((option) => {
    option.hidden = option === button
  })

  if (selection && selectedCoin && selectedIcon) {
    selection.replaceChildren(selectedIcon.cloneNode() as HTMLImageElement, document.createTextNode(selectedCoin))
  }

  setCryptoPicker(false)
}))
document.addEventListener('click', (event) => {
  if (cryptoPicker && !cryptoPicker.contains(event.target as Node)) setCryptoPicker(false)
})
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setCryptoPicker(false)
})
