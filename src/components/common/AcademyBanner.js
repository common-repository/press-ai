import React from 'react';

function AcademyBanner() {

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-8 relative mt-5">

            <h3 className="text-lg text-pressai-primary mb-2">Press AI Academy</h3>
            <p className="text-gray-500">
                Enhance your AI expertise with our comprehensive learning platform, featuring in-depth courses, practical tutorials, and insightful resources to master the art of AI-powered content generation and optimization.
            </p>

            <a onClick={() => window.open('https://press.ai/wordpress/', '_blank')} className="mt-2 inline-block text-pressai-primary underline">Check out Press AI Academy</a>

        </div>
    );

}

export default AcademyBanner;