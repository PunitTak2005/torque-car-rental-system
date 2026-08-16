import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { getCarAvailability } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarCard = ({
  selectedCity = '',
  selectedCarId = null,
  pickupDate = '',
  returnDate = '',
  onDateSelect,
  className = ''
}) => {
  const { addToast } = useToast();

  const todayObj = new Date();
  const currentRealYear = todayObj.getFullYear();
  const currentRealMonth = todayObj.getMonth() + 1; // 1-12
  const currentRealDay = todayObj.getDate();

  const [year, setYear] = useState(currentRealYear);
  const [month, setMonth] = useState(currentRealMonth); // 1-12

  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalCars, setTotalCars] = useState(0);

  // Hover state for range preview
  const [hoverDate, setHoverDate] = useState('');

  // Fetch real availability from API
  useEffect(() => {
    let isMounted = true;

    const cleanCity = (selectedCity && selectedCity !== 'undefined' && selectedCity !== 'null') ? String(selectedCity).trim() : '';
    const cleanCarId = (selectedCarId && selectedCarId !== 'undefined' && selectedCarId !== 'null') ? String(selectedCarId).trim() : '';

    if (!cleanCity && !cleanCarId) {
      setAvailabilityMap({});
      setTotalCars(0);
      setErrorMessage('Select a pickup hub to view availability.');
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const params = { year, month };
        if (cleanCity) params.city = cleanCity;
        if (cleanCarId) params.carId = cleanCarId;

        console.log('[CalendarCard Request]:', params);

        const { data } = await getCarAvailability(params);

        if (isMounted) {
          if (data.success) {
            setAvailabilityMap(data.availabilityMap || {});
            setTotalCars(data.totalCars || 0);
            if (data.totalCars === 0) {
              setErrorMessage('No vehicles available in this pickup hub.');
            }
          } else {
            setErrorMessage(data.message || 'Unable to load availability. Please try again.');
          }
        }
      } catch (err) {
        console.error('[CalendarCard API Error]:', err?.response?.data || err.message);
        if (isMounted) {
          const apiMsg = err.response?.data?.message || 'Unable to load availability. Please try again.';
          setErrorMessage(apiMsg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAvailability();
    return () => { isMounted = false; };
  }, [selectedCity, selectedCarId, year, month]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (year === currentRealYear && month <= currentRealMonth) return;
    if (month === 1) {
      setMonth(12);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
  };

  // Helper to format date YYYY-MM-DD
  const formatDateStr = (y, m, d) => {
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  // Date click handler
  const handleDayClick = (dateStr, isAvailable, isPast) => {
    if (isPast || !isAvailable) {
      addToast('Selected date is unavailable or in the past.', 'warning');
      return;
    }

    if (!pickupDate || (pickupDate && returnDate)) {
      // First click: Set Pickup Date, clear Return Date
      if (onDateSelect) onDateSelect(dateStr, '');
    } else if (pickupDate && !returnDate) {
      if (dateStr < pickupDate) {
        // Reset pickup date to newly selected earlier date
        if (onDateSelect) onDateSelect(dateStr, '');
      } else {
        // Validate that all dates between pickupDate and dateStr are AVAILABLE
        let invalidFound = false;
        const curDate = new Date(pickupDate);
        const targetDate = new Date(dateStr);

        while (curDate <= targetDate) {
          const checkStr = curDate.toISOString().split('T')[0];
          const info = availabilityMap[checkStr];
          if (info && !info.available) {
            invalidFound = true;
            break;
          }
          curDate.setDate(curDate.getDate() + 1);
        }

        if (invalidFound) {
          addToast('Selected date range contains unavailable dates.', 'error');
          return;
        }

        if (onDateSelect) onDateSelect(pickupDate, dateStr);
      }
    }
  };

  // Calculate calendar grid days
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month, 0).getDate();

  const isPrevDisabled = year === currentRealYear && month <= currentRealMonth;

  return (
    <div className={`bg-asphalt/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl font-sans ${className}`}>
      
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-neon-accent" />
          <h4 className="text-xs font-display uppercase tracking-widest text-chalk font-bold">
            {MONTH_NAMES[month - 1]} {year}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className={`p-1.5 rounded-lg border border-white/10 transition-all ${
              isPrevDisabled ? 'opacity-30 cursor-not-allowed bg-graphite/40' : 'hover:bg-graphite hover:border-neon-accent text-chalk'
            }`}
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-white/10 hover:bg-graphite hover:border-neon-accent text-chalk transition-all"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* City/Hub Availability Status Notice */}
      <div className="text-[10px] uppercase font-bold tracking-wider flex items-center justify-between text-silver">
        <span>HUB: <strong className="text-neon-accent">{selectedCity || 'NOT SELECTED'}</strong></span>
        {totalCars > 0 && <span>FLEET: <strong className="text-chalk">{totalCars} VEHICLE(S)</strong></span>}
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="py-12 text-center space-y-2">
          <Loader2 className="w-6 h-6 text-neon-accent animate-spin mx-auto" />
          <p className="text-[10px] text-silver font-bold uppercase tracking-widest">Checking availability...</p>
        </div>
      ) : errorMessage ? (
        <div className="py-8 px-4 text-center bg-graphite/60 border border-white/10 rounded-xl space-y-1.5">
          <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
          <p className="text-xs text-silver font-bold uppercase tracking-wider">{errorMessage}</p>
        </div>
      ) : (
        <>
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-silver uppercase tracking-widest border-b border-white/10 pb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono">
            {/* Blank offset cells */}
            {[...Array(firstDayOfWeek)].map((_, i) => (
              <div key={`empty-${i}`} className="h-9 sm:h-10" />
            ))}

            {/* Month Day Cells */}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const dateStr = formatDateStr(year, month, dayNum);

              const isPast =
                year < currentRealYear ||
                (year === currentRealYear && month < currentRealMonth) ||
                (year === currentRealYear && month === currentRealMonth && dayNum < currentRealDay);

              const isToday =
                year === currentRealYear &&
                month === currentRealMonth &&
                dayNum === currentRealDay;

              const dateInfo = availabilityMap[dateStr];
              const isAvailable = !isPast && (dateInfo ? dateInfo.available : true);

              const isPickup = pickupDate === dateStr;
              const isReturn = returnDate === dateStr;
              const isSelected = isPickup || isReturn;

              const inRange =
                pickupDate &&
                returnDate &&
                dateStr > pickupDate &&
                dateStr < returnDate;

              const inHoverRange =
                pickupDate &&
                !returnDate &&
                hoverDate &&
                dateStr > pickupDate &&
                dateStr <= hoverDate;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleDayClick(dateStr, isAvailable, isPast)}
                  onMouseEnter={() => setHoverDate(dateStr)}
                  onMouseLeave={() => setHoverDate('')}
                  disabled={isPast || !isAvailable}
                  className={`h-9 sm:h-10 rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center border select-none ${
                    isPast
                      ? 'bg-asphalt/30 border-transparent text-silver/30 cursor-not-allowed line-through'
                      : !isAvailable
                      ? 'bg-rose-950/20 border-rose-900/30 text-rose-300/50 cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'bg-neon-accent text-asphalt font-black border-neon-accent shadow-lg scale-105 z-10'
                      : inRange || inHoverRange
                      ? 'bg-neon-accent/20 text-neon-accent border-neon-accent/40'
                      : 'bg-graphite/70 border-white/10 text-chalk hover:border-neon-accent hover:bg-neon-accent/10 cursor-pointer'
                  } ${isToday && !isSelected ? 'border-neon-accent/80 font-black' : ''}`}
                >
                  <span>{dayNum}</span>

                  {/* Indicator Dot */}
                  {!isPast && (
                    <span
                      className={`w-1 h-1 rounded-full mt-0.5 ${
                        isSelected
                          ? 'bg-asphalt'
                          : isAvailable
                          ? 'bg-emerald-400'
                          : 'bg-rose-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Status Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[9px] uppercase font-bold text-silver">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-neon-accent" />
              <span>Selected</span>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default CalendarCard;
