import React, { useState } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  description?: string;
  linkedAlarmId?: string;
}

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  onEventCreate?: (event: CalendarEvent, createAlarm?: boolean) => void;
  events?: CalendarEvent[];
}

export const Calendar: React.FC<CalendarProps> = ({ onDateSelect, onEventCreate, events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [createAlarmForEvent, setCreateAlarmForEvent] = useState(false);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const selectDate = (day: number) => {
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDate(selected);
    onDateSelect?.(selected);
  };

  const addEvent = () => {
    if (!selectedDate || !newEventTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: newEventTitle.trim(),
      date: selectedDate,
      time: newEventTime || undefined,
      description: newEventDescription.trim() || undefined,
    };

    onEventCreate?.(newEvent, createAlarmForEvent);
    
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventDescription('');
    setCreateAlarmForEvent(false);
    setShowEventForm(false);
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const hasEventsOnDate = (day: number) => {
    return getEventsForDate(day).length > 0;
  };

  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isSelected = (day: number) => {
    return (
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const renderDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar__day calendar__day--empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const isSelectedDay = isSelected(day);

      const hasEvents = hasEventsOnDate(day);
      
      days.push(
        <button
          key={day}
          className={`calendar__day ${isCurrentDay ? 'calendar__day--today' : ''} ${isSelectedDay ? 'calendar__day--selected' : ''} ${hasEvents ? 'calendar__day--has-events' : ''}`}
          onClick={() => selectDate(day)}
        >
          {day}
          {hasEvents && <span className="calendar__day-indicator">•</span>}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button className="calendar__nav" onClick={previousMonth}>
          ←
        </button>
        <h3 className="calendar__title">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button className="calendar__nav" onClick={nextMonth}>
          →
        </button>
      </div>
      
      <div className="calendar__weekdays">
        {dayNames.map(day => (
          <div key={day} className="calendar__weekday">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar__grid">
        {renderDays()}
      </div>
      
      {selectedDate && (
        <div className="calendar__selected">
          <div className="calendar__selected-date">
            Selected: {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          
          <div className="calendar__event-actions">
            <button
              className="calendar__add-event"
              onClick={() => setShowEventForm(!showEventForm)}
            >
              {showEventForm ? 'Cancel' : '+ Add Event'}
            </button>
          </div>

          {showEventForm && (
            <div className="calendar__event-form">
              <div className="calendar__form-group">
                <label className="calendar__label">Event Title:</label>
                <input
                  type="text"
                  className="calendar__input"
                  placeholder="Meeting, Appointment, etc."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
              </div>

              <div className="calendar__form-group">
                <label className="calendar__label">Time (optional):</label>
                <input
                  type="time"
                  className="calendar__input"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                />
              </div>

              <div className="calendar__form-group">
                <label className="calendar__label">Description (optional):</label>
                <textarea
                  className="calendar__textarea"
                  placeholder="Event details..."
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="calendar__form-group">
                <label className="calendar__checkbox-label">
                  <input
                    type="checkbox"
                    checked={createAlarmForEvent}
                    onChange={(e) => setCreateAlarmForEvent(e.target.checked)}
                  />
                  Create alarm for this event
                </label>
              </div>

              <div className="calendar__form-actions">
                <button className="calendar__cancel" onClick={() => setShowEventForm(false)}>
                  Cancel
                </button>
                <button 
                  className="calendar__save" 
                  onClick={addEvent} 
                  disabled={!newEventTitle.trim()}
                >
                  Add Event
                </button>
              </div>
            </div>
          )}

          <div className="calendar__events">
            {getEventsForDate(selectedDate.getDate()).map(event => (
              <div key={event.id} className="calendar__event-item">
                <div className="calendar__event-title">{event.title}</div>
                {event.time && <div className="calendar__event-time">{event.time}</div>}
                {event.description && <div className="calendar__event-description">{event.description}</div>}
                {event.linkedAlarmId && <div className="calendar__event-alarm">🔔 Alarm set</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};