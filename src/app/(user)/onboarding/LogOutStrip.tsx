"use client";

import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '~/components/ui/button';

const LogOutStrip = () => {
  return (
    <section className='w-full container pt-6 flex items-center justify-end'>
        <Button onClick={() => signOut({ callbackUrl: "/login" })}>
            Log Out
        </Button>
    </section>
  )
}

export default LogOutStrip;