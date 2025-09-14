"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlay, FaPause, FaRedo, FaInfoCircle, FaLightbulb } from 'react-icons/fa';
import { CookingStep } from '../data/recipes';

interface CookingStepsProps {
  steps: CookingStep[];
}

export default function CookingSteps({ steps }: CookingStepsProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showTip, setShowTip] = useState<number | null>(null);

  // Parse duration string to seconds
  const parseDuration = (duration: string): number => {
    if (!duration) return 0;
    
    const minutesMatch = duration.match(/(\d+)\s*mins?/);
    const secondsMatch = duration.match(/(\d+)\s*secs?/);
    
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
    
    return (minutes * 60) + seconds;
  };

  // Initialize timer when active step changes
  useEffect(() => {
    const currentStep = steps[activeStep];
    if (currentStep?.duration) {
      const seconds = parseDuration(currentStep.duration);
      setRemainingTime(seconds);
      setTimerActive(false);
    } else {
      setRemainingTime(0);
      setTimerActive(false);
    }
  }, [activeStep, steps]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setTimerActive(false);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, remainingTime]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startTimer = () => {
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    const currentStep = steps[activeStep];
    if (currentStep?.duration) {
      setRemainingTime(parseDuration(currentStep.duration));
      setTimerActive(false);
    }
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const toggleTip = (index: number) => {
    setShowTip(showTip === index ? null : index);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <h2 className="text-xl font-bold text-white mb-6">Cooking Instructions</h2>
      
      {/* Current step detailed view */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">
            Step {activeStep + 1}: {steps[activeStep]?.title}
          </h3>
          <div className="text-sm text-gray-400">
            {activeStep + 1} of {steps.length}
          </div>
        </div>
        
        {/* Step image if available */}
        {steps[activeStep]?.image && (
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={steps[activeStep].image!}
              alt={steps[activeStep].title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 60vw"
            />
          </div>
        )}
        
        {/* Step description */}
        <p className="text-gray-300 mb-4">{steps[activeStep]?.description}</p>
        
        {/* Cooking tip if available */}
        {steps[activeStep]?.tip && (
          <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-lg p-3 mb-4 flex">
            <FaLightbulb className="text-yellow-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">{steps[activeStep].tip}</p>
          </div>
        )}
        
        {/* Timer section */}
        {steps[activeStep]?.duration && (
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Estimated Time:</span>
              <span className="text-white">{steps[activeStep].duration}</span>
            </div>
            
            <div className="flex justify-center items-center mb-3">
              <div className="text-2xl font-bold text-white">
                {formatTime(remainingTime)}
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              {!timerActive ? (
                <button
                  onClick={startTimer}
                  className="bg-green-600 hover:bg-green-500 text-white rounded-full p-3 transition-colors"
                  disabled={remainingTime === 0}
                >
                  <FaPlay className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white rounded-full p-3 transition-colors"
                >
                  <FaPause className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={resetTimer}
                className="bg-gray-600 hover:bg-gray-500 text-white rounded-full p-3 transition-colors"
              >
                <FaRedo className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className={`px-4 py-2 rounded-lg ${
              activeStep > 0 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-700 bg-opacity-50 text-gray-500 cursor-not-allowed'
            } transition-colors`}
            disabled={activeStep === 0}
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            className={`px-4 py-2 rounded-lg ${
              activeStep < steps.length - 1 
                ? 'bg-yellow-500 hover:bg-yellow-400 text-black' 
                : 'bg-gray-700 bg-opacity-50 text-gray-500 cursor-not-allowed'
            } transition-colors`}
            disabled={activeStep === steps.length - 1}
          >
            Next Step
          </button>
        </div>
      </div>
      
      {/* Steps progress overview */}
      <div>
        <h3 className="text-white font-medium mb-4">All Steps</h3>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`rounded-lg p-3 cursor-pointer transition-colors ${
                index === activeStep 
                  ? 'bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-40' 
                  : index < activeStep 
                    ? 'bg-green-500 bg-opacity-20 border border-green-500 border-opacity-40' 
                    : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setActiveStep(index)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                    index === activeStep 
                      ? 'bg-yellow-500 text-black' 
                      : index < activeStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`font-medium ${
                    index === activeStep ? 'text-yellow-200' : 'text-white'
                  }`}>
                    {step.title}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {step.duration && (
                    <span className="text-sm text-gray-400">{step.duration}</span>
                  )}
                  
                  {step.tip && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTip(index);
                      }}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <FaInfoCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Cooking tip popover */}
              {showTip === index && step.tip && (
                <div className="mt-2 text-sm text-yellow-200 bg-gray-800 bg-opacity-70 p-2 rounded">
                  <p className="flex">
                    <FaLightbulb className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-yellow-500" />
                    <span>{step.tip}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}