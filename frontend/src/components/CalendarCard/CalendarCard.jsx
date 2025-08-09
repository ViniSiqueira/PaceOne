import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarCard.css';

const CalendarCard = () => {
  const [value, setValue] = useState(new Date());

  const events = {
    '2025-07-11': ['Evento da academia'],
    '2025-07-15': ['Aula de dança'],
    '2025-07-20': ['Treino funcional', 'Palestra de nutrição']
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  return (
    <div>
      <Calendar
        onChange={setValue}
        value={value}
        locale="pt-BR"
        tileContent={({ date }) => {
          const key = formatDate(date);
          if (events[key]) {
            return (
              <div className="event-calendar-card" title={events[key].join(', ')}></div>
            );
          }
          return null;
        }}
        tileClassName={({ date }) => {
          const key = formatDate(date);
          if (events[key]) {
            return 'highlight-day-calendar-card';
          }
          return null;
        }}
      />
    </div>
  );
};

export default CalendarCard;
