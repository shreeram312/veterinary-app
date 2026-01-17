"use client";
    import React from 'react'
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

const AuthWrap = ({ children }: { children: React.ReactNode     

}) => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (!session) {
    redirect("/login");
  }
  return <div>{children}</div>;
    };

export default AuthWrap;