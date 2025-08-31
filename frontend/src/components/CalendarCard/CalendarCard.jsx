import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarCard.css';
import { API_BACKEND_URL } from '../../constants/url';

const CalendarCard = () => {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BACKEND_URL}/api/rotina`);
        if (!response.ok) throw new Error('Erro ao buscar eventos');

        const data = await response.json();

        // Agrupar eventos por data no formato local
        const groupedEvents = data.reduce((acc, event) => {
          const dateKey = new Date(event.inicio).toLocaleDateString('pt-BR');
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(event.titulo);
          return acc;
        }, {});

        setEvents(groupedEvents);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString('pt-BR');

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
              <div
                className="event-calendar-card"
                title={events[key].join(', ')}
              ></div>
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
