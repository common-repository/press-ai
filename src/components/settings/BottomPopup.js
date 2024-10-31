import React, {useEffect, useState} from 'react'

function BottomPopup({ show, onSave, onDiscard }) {
    const [visible, setVisible] = useState(false);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (show) {
            setVisible(true);
            setAnimationClass('slide-down');
        } else {
            setAnimationClass('slide-up');
            setTimeout(() => {
                setVisible(false);
            }, 300);
        }
    }, [show]);

    return (
        visible && (
            <footer className={`sticky bottom-0 z-10 ${animationClass}`}>
                <div className="bg-slate-50 rounded-b-lg border-t border-gray-300">
                    <div className="flex p-8 space-x-4">
                        <button
                            type="submit"
                            onClick={onSave}
                            className="px-3 py-1.5 text-white text-sm bg-pressai-primary rounded focus:outline-none focus:ring-2 focus:ring-pressai-primary focus:ring-offset-1"
                        >
                            Save changes
                        </button>
                        <button
                            type="button"
                            onClick={onDiscard}
                            className="px-3 py-1.5 text-sm text-gray-800 shadow-md bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                        >
                            Discard changes
                        </button>
                    </div>
                </div>
            </footer>
        )
    )
}

export default BottomPopup
