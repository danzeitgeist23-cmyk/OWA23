import React from 'react';
import Hero from '../components/Hero';
import TopDestinations from '../components/TopDestinations';
import InspiredTrips from '../components/InspiredTrips';
import BestOfCanary from '../components/BestOfCanary';
import WhyOWA from '../components/WhyOWA';
import Testimonials from '../components/Testimonials';
import Stories from '../components/Stories';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <TopDestinations />
      <InspiredTrips />
      <WhyOWA />
      <BestOfCanary />
      <Testimonials />
      <Stories />
      <Newsletter />
    </>
  );
}
