import React, { useState, useEffect, useCallback } from 'react';

interface AlarmItem {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: string[];
}

interface AlarmProps {
  onAlarmTrigger?: (alarm: AlarmItem) => void;
}

const dayOptions = [
  { key: 'sun', label: 'Sun' },
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
];

export const Alarm: React.FC<AlarmProps> = ({ onAlarmTrigger }) => {
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const triggerAlarm = useCallback((alarm: AlarmItem) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Alarm: ${alarm.label || 'Time to wake up!'}`, {
        body: `It's ${alarm.time}`,
        icon: '/vite.svg'
      });
    }

    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjKKr/+9eT8G');
    audio.play().catch(() => {});

    onAlarmTrigger?.(alarm);
  }, [onAlarmTrigger]);

  const checkAlarms = useCallback(() => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDay = dayOptions[now.getDay()].key;

    alarms.forEach(alarm => {
      if (
        alarm.enabled &&
        alarm.time === currentTime &&
        (alarm.days.length === 0 || alarm.days.includes(currentDay))
      ) {
        triggerAlarm(alarm);
      }
    });
  }, [alarms, triggerAlarm]);

  useEffect(() => {
    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [checkAlarms]);


  const addAlarm = () => {
    if (!newAlarmTime) return;

    const newAlarm: AlarmItem = {
      id: Date.now().toString(),
      time: newAlarmTime,
      label: newAlarmLabel || 'Alarm',
      enabled: true,
      days: selectedDays,
    };

    setAlarms(prev => [...prev, newAlarm]);
    setNewAlarmTime('');
    setNewAlarmLabel('');
    setSelectedDays([]);
    setShowAddForm(false);

    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const formatAlarmTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDays = (days: string[]) => {
    if (days.length === 0) return 'Once';
    if (days.length === 7) return 'Daily';
    return days.map(day => dayOptions.find(d => d.key === day)?.label).join(', ');
  };

  return (
    <div className="alarm">
      <div className="alarm__header">
        <h3 className="alarm__title">Alarms</h3>
        <button
          className="alarm__add-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '×' : '+'}
        </button>
      </div>

      {showAddForm && (
        <div className="alarm__add-form">
          <div className="alarm__form-group">
            <label className="alarm__label">Time:</label>
            <input
              type="time"
              className="alarm__time-input"
              value={newAlarmTime}
              onChange={(e) => setNewAlarmTime(e.target.value)}
            />
          </div>

          <div className="alarm__form-group">
            <label className="alarm__label">Label:</label>
            <input
              type="text"
              className="alarm__text-input"
              placeholder="Wake up, Meeting, etc."
              value={newAlarmLabel}
              onChange={(e) => setNewAlarmLabel(e.target.value)}
            />
          </div>

          <div className="alarm__form-group">
            <label className="alarm__label">Repeat:</label>
            <div className="alarm__days">
              {dayOptions.map(day => (
                <button
                  key={day.key}
                  className={`alarm__day ${selectedDays.includes(day.key) ? 'alarm__day--selected' : ''}`}
                  onClick={() => toggleDay(day.key)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="alarm__form-actions">
            <button className="alarm__cancel" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button className="alarm__save" onClick={addAlarm} disabled={!newAlarmTime}>
              Save Alarm
            </button>
          </div>
        </div>
      )}

      <div className="alarm__list">
        {alarms.length === 0 ? (
          <div className="alarm__empty">No alarms set</div>
        ) : (
          alarms.map(alarm => (
            <div key={alarm.id} className="alarm__item">
              <div className="alarm__item-main">
                <div className="alarm__item-time">
                  {formatAlarmTime(alarm.time)}
                </div>
                <div className="alarm__item-details">
                  <div className="alarm__item-label">{alarm.label}</div>
                  <div className="alarm__item-days">{formatDays(alarm.days)}</div>
                </div>
              </div>
              
              <div className="alarm__item-controls">
                <button
                  className={`alarm__toggle ${alarm.enabled ? 'alarm__toggle--on' : 'alarm__toggle--off'}`}
                  onClick={() => toggleAlarm(alarm.id)}
                >
                  {alarm.enabled ? 'ON' : 'OFF'}
                </button>
                <button
                  className="alarm__delete"
                  onClick={() => deleteAlarm(alarm.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};