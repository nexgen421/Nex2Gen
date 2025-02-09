import React from 'react';
import { Raleway } from 'next/font/google';
import { cn } from '~/lib/utils';
import RateCalculatorForm from './_RateCalculatorForm';

const raleway = Raleway({ subsets: ['latin'] });

const page = () => {
  return (
    <section className={cn('md:px-20 px-10 mt-10', raleway.className)}>
        <h1 className='text-3xl font-semibold'>Rate Calculator</h1>
        <RateCalculatorForm />
    </section>
  )
}

export default page;