import { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { heroVideo, smallHeroVideo } from '../utils'

export const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  )

  const handleSetVideoSrc = () => {
    const adjustedVideoSrc =
      window.innerWidth < 760 ? smallHeroVideo : heroVideo
    setVideoSrc(adjustedVideoSrc)
  }
  
  useGSAP(() => {
    gsap.to('#hero', {
      opacity: 1,
      delay: 2,
    })
    gsap.to('#cta', {
      opacity: 1,
      y: -50,
      delay: 2,
    })
  })

  useEffect(() => {
    window.addEventListener('resize', handleSetVideoSrc)

    return () => {
      window.removeEventListener('resize', handleSetVideoSrc)
    }
  }, [])
  return (
    <section className='w-full nav-height bg-black relative'>
      <div className='h-5/6 w-full flex-center flex-col'>
        <p className='hero-title' id='hero'>
          iPhone 15 Pro
        </p>
        <div className='md:w-10/12 w-9/12'>
          <video
            autoPlay
            muted
            playsInline
            key={videoSrc}
            className='pointer-events-none'
          >
            <source src={videoSrc} />
          </video>
        </div>
        <div
          id='cta'
          className='flex flex-col items-center opacity-0 translate-y-20'
        >
          <a href='#highlights' className='btn'>
            Buy
          </a>
          <p className='font-normal text-xl'>From $199/month or $999</p>
        </div>
      </div>
    </section>
  )
}
