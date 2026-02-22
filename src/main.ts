import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { CinematicStage } from './engine/CinematicStage'

gsap.registerPlugin(ScrollTrigger)

// --- Smooth Scroller Orchestration ---
const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.8,
    smoothWheel: true,
})

function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// --- Hero Cinematic Engine ---
const heroStage = new CinematicStage('hero-canvas', 41, '/sequences/hero/ezgif-frame-###.jpg')
const preloader = document.querySelector('.preloader')!

heroStage.preload().then(() => {
    // Dismiss Preloader
    preloader.classList.add('fade-out')

    // Reveal initial state
    gsap.to('.logo', { opacity: 1, duration: 1.5, ease: 'power4.out', delay: 0.5 })
})

// Sync Hero Sequence to Scroll
gsap.to(heroStage, {
    currentFrame: 40,
    ease: 'none',
    scrollTrigger: {
        trigger: '.cinematic-stage',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: () => heroStage.render(),
    },
})

// --- Storytelling Step Sync ---
const storySteps = document.querySelectorAll('.story-step')
storySteps.forEach((step) => {
    const h1 = step.querySelector('h1')
    const p = step.querySelector('p')
    const btn = step.querySelector('.reveal-btn')

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: step,
            start: 'top 60%',
            end: 'bottom 40%',
            toggleActions: 'play reverse play reverse',
        },
    })

    tl.to(h1, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 1,
        ease: 'power4.out',
    })
        .to(p, {
            opacity: 1,
            duration: 0.8,
            filter: 'blur(0px)',
        }, '-=0.6')

    if (btn) {
        tl.to(btn, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.5,
            ease: 'back.out(2)',
        }, '-=0.3')
    }
})

// --- Intro & Partners Reveals ---
gsap.from('.partners-grid span', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 1,
    scrollTrigger: {
        trigger: '.partners-bar',
        start: 'top 90%',
    }
})

// --- ROI / Math Section Reveal ---
const roiTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.roi-math',
        start: 'top 80%',
    }
})

roiTl.from('.roi-content h2, .roi-content .body-text', {
    opacity: 0,
    y: 50,
    duration: 1.2,
    stagger: 0.2,
    ease: 'power4.out'
})
    .from('.roi-card', {
        opacity: 0,
        x: 50,
        duration: 1.2,
        ease: 'power4.out'
    }, '-=1')
    .from('.roi-card .stat-item', {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.8
    }, '-=0.5')

gsap.from('.precision-intro .reveal-text', {
    opacity: 0,
    y: 80,
    duration: 1.2,
    scrollTrigger: {
        trigger: '.precision-intro',
        start: 'top 85%',
    }
})

// --- Testimonial Luxury Batch Reveals ---
ScrollTrigger.batch('.testimonial-card', {
    onEnter: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1.2,
            ease: 'power4.out',
            overwrite: true
        })
    },
    start: 'top 85%'
})

// --- Sovereign Pulse Transition ---
const sweepCanvas = document.querySelector('.sweep-canvas') as HTMLCanvasElement
const sweepStage = new CinematicStage('revenue-sweep-canvas', 26, '/sequences/infrastructure/ezgif-frame-###.jpg')
const triggerBtn = document.getElementById('trigger-infrastructure')!
const revenueControls = document.querySelector('.revenue-controls')!
const closeRevenue = document.getElementById('close-revenue')!

triggerBtn.addEventListener('click', () => {
    // Reveal Controls & Stage
    revenueControls.classList.add('active')
    sweepCanvas.classList.add('active')

    const stage = document.querySelector('.cinematic-stage')!
    stage.classList.add('scanning')

    sweepStage.preload().then(() => {
        gsap.to(sweepStage, {
            currentFrame: 25,
            duration: 2.5, // Slightly faster for higher impact
            ease: 'power4.inOut', // More dramatic easing
            onUpdate: () => sweepStage.render()
        })
    })
})

closeRevenue.addEventListener('click', () => {
    // Escape Sequence
    revenueControls.classList.remove('active')
    gsap.to(sweepCanvas, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            sweepCanvas.classList.remove('active')
            gsap.set(sweepCanvas, { clearProps: 'opacity' })
            const stage = document.querySelector('.cinematic-stage')!
            stage.classList.remove('scanning')
        }
    })
})

// Final Conversion
gsap.from('.conversion .reveal-text', {
    opacity: 0,
    y: 30,
    duration: 1,
    scrollTrigger: {
        trigger: '.conversion',
        start: 'top 90%'
    }
})
