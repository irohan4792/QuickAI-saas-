import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import Aitools from '../components/Aitools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Aitools/>
      <Testimonial/>
      <Plan/>
      <Footer/>
    </>
  )
}

export default Home