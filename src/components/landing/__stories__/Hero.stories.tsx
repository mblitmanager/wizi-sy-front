import React from 'react';
import Hero from '../Hero';

export default {
  title: 'Landing/Hero',
  component: Hero,
};

export const Default = () => <Hero logo={new URL('@/assets/logo.png', import.meta.url).href} />;
