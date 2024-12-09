import React from 'react';

interface MainProps {
  children: any;
}

export default function Main({ children }: MainProps) {
  return <div className='mx-6 flex flex-col space-y-2'>{children}</div>
}
