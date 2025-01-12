import React from 'react';
import { cn } from '~/lib/utils';

interface ButtonProps {
    className?: string,
    children: React.ReactNode
}

const SpecialButton: React.FC<ButtonProps> = ({ children, className }) => {
    return <button className={cn("px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4", className)}>
    <span>{children}</span>
    <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
  </button>
}

export default SpecialButton;