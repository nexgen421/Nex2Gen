import React from 'react'
import LoginForm from './_LoginForm';
import { api } from '~/trpc/server';
import { redirect, RedirectType } from 'next/navigation';

const Login = async () => {
  try {
    const session = await api.adminAuth.fetchSession();
    if (session) {
      redirect("/admin/dashboard", RedirectType.replace);
    }
  } catch (error) {
    return <LoginForm />
  }
}

export default Login;