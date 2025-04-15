import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';
import { useBadge } from '../contexts/BadgeContext';

function DropdownProfile({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  const { badge: showcasedBadge } = useBadge();

  // Click outside dropdown
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current || !trigger.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };

    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none" ref={trigger}>
        {/* Display badge if selected, else show placeholder */}
        {showcasedBadge ? (
          <img
            src={`/images/WattBadges/${showcasedBadge.image}`}
            alt={showcasedBadge.name}
            className="w-14 h-14 rounded-full border-2 border-violet-500 shadow-md hover:scale-105 transition-transform"
            title="Click to manage badge"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-white">No Badge</span>
          </div>
        )}
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-3 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          {/* If a badge is selected, show its details */}
          {showcasedBadge ? (
            <div className="flex flex-col items-center px-4 pb-2 border-b border-gray-200 dark:border-gray-700/60">
              <img
                src={`/images/WattBadges/${showcasedBadge.image}`}
                alt={showcasedBadge.name}
                className="w-48 h-48 rounded-full shadow-lg mb-2"
              />
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 text-center">
                <span className="font-semibold">{showcasedBadge.name}</span>
              </p>
            </div>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              <p>No badge selected</p>
            </div>
          )}

          {/* Change badge link */}
          <div className="px-4 pt-3">
            <Link
              to="/badges"
              onClick={() => setDropdownOpen(false)}
              className="w-full block text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-center transition-colors"
            >
              {showcasedBadge ? 'Change showcased badge' : 'Select a badge'}
            </Link>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;
