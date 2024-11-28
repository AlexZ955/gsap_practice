import { useRef } from 'react'
import { highlightsSlides } from '../constants'
import { useState } from 'react'
import { useEffect } from 'react'
import gsap from 'gsap'
import { pauseImg, playImg, replayImg } from '../utils'
import { useGSAP } from '@gsap/react'
export const VideoCarousel = () => {
  const videoRef = useRef([])
  const videoSpanRef = useRef([])
  const videoDivRef = useRef([])

  const lastVideoIndex = highlightsSlides.length - 1

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  })

  const [loadedData, setLoadedData] = useState([])

  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video

  useGSAP(() => {
    // swipe the slider when the video is over
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut',
    })

    // play the video only when videos are in the view
    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none',
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }))
      },
    })
  }, [isEnd, videoId])

  useEffect(() => {
    if (loadedData.length > lastVideoIndex) {
      if (!isPlaying) {
        videoRef.current[videoId].pause()
      } else {
        startPlay && videoRef.current[videoId].play()
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData])

  const handleLoadedMetadata = (i, e) => setLoadedData((pre) => [...pre, e])

  useEffect(() => {
    let currentProgress = 0
    let span = videoSpanRef.current

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100)

          if (progress !== currentProgress) {
            currentProgress = progress

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? '10vw'
                  : window.innerWidth < 1200
                  ? '10vw'
                  : '4vw',
            })

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white',
            })
          }
        },

        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
            })

            gsap.to(span[videoId], {
              backgroundColor: '#afafaf',
            })
          }
        },
      })

      if (videoId === 0) {
        anim.restart()
      }

      // update the progress bar
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            highlightsSlides[videoId].videoDuration
        )
      }

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animUpdate)
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate)
      }
    }
  }, [videoId, startPlay, isPlaying])

  const handleProcess = (type, i) => {
    switch (type) {
      case 'video-end':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: i + 1,
        }))
        break
      case 'video-last':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: true,
        }))
        break

      case 'video-reset':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }))
        break
      case 'play':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }))
        break
      case 'pause':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }))
        break
      default:
        return video
    }
  }

  return (
    <>
      <div className='flex items-center'>
        {highlightsSlides.map((list, i) => (
          <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
            <div className='video-carousel_container'>
              <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                <video
                  id='video'
                  className={`${
                    list.id === 2 && 'translate-x-44'
                  } pointer-events-none`}
                  playsInline
                  preload='auto'
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }))
                  }}
                  onEnded={() =>
                    i !== lastVideoIndex
                      ? handleProcess('video-end', i)
                      : handleProcess('video-last')
                  }
                  onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                >
                  <source src={list.video} type='video/mp4' />
                </video>
              </div>
              <div className='absolute top-12 left-[5%] z-10'>
                {list.textLists.map((text) => (
                  <p key={text} className='md:text-2xl text-xl font-medium'>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='relative flex-center mt-10'>
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
            >
              <span
                className='absolute h-full w-full rounded-full left-0'
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>
        <button className='control-btn'>
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={
              isLastVideo
                ? () => handleProcess('video-reset')
                : !isPlaying
                ? () => handleProcess('play')
                : () => handleProcess('pause')
            }
          />
        </button>
      </div>
    </>
  )
}
