import React from 'react';

const RocketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a12.025 12.025 0 01-4.132 4.095m-4.132-4.095L2.5 21.5m9.84-15.18a12.025 12.025 0 00-4.132-4.095m4.132 4.095L12 2.5m0 0l-2.25 4.5m2.25-4.5L14.25 7l-2.25-4.5m-2.25 4.5L7.5 12m4.5-4.5l2.25 4.5" />
    </svg>
);

const ComingSoon: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 rounded-lg animate-fadeIn text-center p-8">
            <RocketIcon />
            <h2 className="mt-4 text-2xl font-bold text-white">Coming Soon!</h2>
            <p className="mt-2 text-gray-400">
                Our team is hard at work building this visualization. <br/>
                Check back later to see it in action.
            </p>
        </div>
    );
};

export default ComingSoon;
