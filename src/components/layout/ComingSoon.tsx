"use client"

import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ComingSoon = () => {
  const router = useRouter();
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
        <div className="mx-auto max-w-md text-center ">
          <Image src={'/logo.png'} height={200} width={200} alt='logo' className="mx-auto text-primary mb-10" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Coming Soon</h1>
          <p className="mt-4 text-muted-foreground">We&apos;re working hard to bring you something amazing. Stay tuned!</p>
          <Button onClick={() => router.back()} className='flex items-center gap-2 mx-auto mt-4 justify-center'>
            <ArrowLeft className='w-5 h-5' />
            <span>Go Back</span>
          </Button>
        </div>
      </div>
  )
}

export default ComingSoon;