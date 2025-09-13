import React from 'react';
import { Atom, Zap, Activity, Cpu } from 'lucide-react';

interface ScientificLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScientificLoader: React.FC<ScientificLoaderProps> = ({ 
  message = "Processing...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerSizeClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={`flex flex-col items-center ${containerSizeClasses[size]}`}>
        {/* Scientific Animation Container */}
        <div className="relative">
          {/* Central Processing Core */}
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse opacity-20"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-spin opacity-40"></div>
            <div className="absolute inset-4 rounded-full bg-white/10 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
          </div>

          {/* Orbiting Particles */}
          <div className="absolute inset-0">
            {/* Particle 1 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-[spin_2s_linear_infinite]">
                <Atom className="w-2 h-2 text-emerald-400" />
              </div>
            </div>
            
            {/* Particle 2 */}
            <div className="absolute top-1/2 right-0 translate-x-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full animate-[spin_2.5s_linear_infinite_reverse]">
                <Zap className="w-2 h-2 text-violet-400" />
              </div>
            </div>
            
            {/* Particle 3 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-[spin_1.8s_linear_infinite]">
                <Activity className="w-2 h-2 text-orange-400" />
              </div>
            </div>
            
            {/* Particle 4 */}
            <div className="absolute top-1/2 left-0 -translate-x-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-[spin_2.2s_linear_infinite_reverse]">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Energy Rings */}
          <div className="absolute inset-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]">
            <div className="absolute inset-0 rounded-full border border-blue-400/30"></div>
          </div>
          <div className="absolute inset-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-1000">
            <div className="absolute inset-2 rounded-full border border-cyan-400/20"></div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground/80 animate-pulse">
            {message}
          </p>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};