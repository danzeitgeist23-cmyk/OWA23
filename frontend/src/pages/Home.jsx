import React from 'react';
import Hero from '../components/Hero';
import CategoryQuickLinks from '../components/CategoryQuickLinks';
import TrustBar from '../components/TrustBar';
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
      <CategoryQuickLinks />
      <TrustBar />
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
