import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import toast from "react-hot-toast";
import "./Routine.css";
import { API_BACKEND_URL } from "../../constants/url";

function keyFromDate(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // YYYY-MM-DD
}

const Routine = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventsByDate, setEventsByDate] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    inicio: null,
    fim: null,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BACKEND_URL}/api/rotina`);
      if (!response.ok) throw new Error("Erro ao buscar eventos");
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar eventos");
    }
  };

  // Indexa eventos por dia (YYYY-MM-DD) para o calendário
  useEffect(() => {
    const map = {};
    for (const ev of events) {
      const k = keyFromDate(ev.inicio);
      if (!map[k]) map[k] = [];
      map[k].push(ev);
    }
    setEventsByDate(map);
  }, [events]);

  const handleAddEvent = (selectedDate) => {
    // inicia com a data selecionada (horários podem ser ajustados nos campos)
    const base = new Date(selectedDate);
    setForm({
      titulo: "",
      descricao: "",
      inicio: base,
      fim: base,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      const response = await fetch(`${API_BACKEND_URL}/api/rotina/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao excluir evento");
      toast.success("Evento excluído com sucesso!");
      fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir evento");
    }
  };

  const handleSave = async () => {
    if (!form.titulo || !form.inicio || !form.fim) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    try {
      const payload = {
        ...form,
        // garante ISO ao enviar
        inicio: new Date(form.inicio).toISOString(),
        fim: new Date(form.fim).toISOString(),
      };

      const response = await fetch(`${API_BACKEND_URL}/api/rotina`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao salvar evento");

      toast.success("Evento salvo com sucesso!");
      setShowDialog(false);
      fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar evento");
    }
  };

  const selectedKey = keyFromDate(date);
  const eventsForSelectedDate = (eventsByDate[selectedKey] || []).slice().sort(
    (a, b) => new Date(a.inicio) - new Date(b.inicio)
  );

  return (
    <div className="routine-container">
      <div className="routine-header">
        <h2>Rotina</h2>
        <Button
          label="Adicionar Evento"
          icon="pi pi-plus"
          onClick={() => handleAddEvent(date)}
        />
      </div>

      <div className="routine-calendar-container">
        <Calendar
          onChange={(selectedDate) => setDate(selectedDate)}
          value={date}
          // Não cria no clique (apenas seleciona o dia)
          // onClickDay={(selectedDate) => handleAddEvent(selectedDate)}
          locale="pt-BR"
          tileContent={({ date: tileDate }) => {
            const k = keyFromDate(tileDate);
            const list = eventsByDate[k] || [];
            if (!list.length) return null;

            const extra = list.length - 3;
            return (
              <div className="rc-dots" title={`${list.length} evento(s)`}>
                {list.slice(0, 3).map((_, i) => (
                  <span key={i} className="rc-dot" />
                ))}
                {extra > 0 && <span className="rc-more">+{extra}</span>}
              </div>
            );
          }}
        />
      </div>

      <h3 className="routine-events-title">
        Eventos do dia {date.toLocaleDateString("pt-BR")}
      </h3>

      {eventsForSelectedDate.length === 0 ? (
        <p>Não há eventos para este dia.</p>
      ) : (
        <ul className="routine-events-list">
          {eventsForSelectedDate.map((event) => (
            <li key={event.id} className="routine-event-item">
              <div className="routine-event-info">
                <strong>{event.titulo}</strong>{" "}
                —{" "}
                {new Date(event.inicio).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                às{" "}
                {new Date(event.fim).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {event.descricao && <p>{event.descricao}</p>}
              </div>
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-rounded p-button-sm"
                onClick={() => handleDelete(event.id)}
                tooltip="Excluir evento"
              />
            </li>
          ))}
        </ul>
      )}

      <Dialog
        header="Adicionar Evento"
        visible={showDialog}
        style={{ width: "450px" }}
        onHide={() => setShowDialog(false)}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setShowDialog(false)}
              className="p-button-text"
            />
            <Button label="Salvar" icon="pi pi-check" onClick={handleSave} autoFocus />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="title">Título*</label>
            <InputText
              id="title"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </div>

          <div className="p-field">
            <label htmlFor="description">Descrição</label>
            <InputTextarea
              id="description"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={3}
            />
          </div>

          <div className="p-field">
            <label>Data do evento*</label>
            <InputText
              type="date"
              value={form.inicio ? new Date(form.inicio).toISOString().split("T")[0] : ""}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value + "T00:00:00");
                setForm({
                  ...form,
                  inicio: selectedDate,
                  fim: selectedDate,
                });
              }}
              required
            />
          </div>

          <div className="p-field">
            <label>Hora de início*</label>
            <PrimeCalendar
              value={form.inicio}
              onChange={(e) => setForm({ ...form, inicio: e.value })}
              showTime
              timeOnly
              hourFormat="24"
            />
          </div>

          <div className="p-field">
            <label>Hora final*</label>
            <PrimeCalendar
              value={form.fim}
              onChange={(e) => setForm({ ...form, fim: e.value })}
              showTime
              timeOnly
              hourFormat="24"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Routine;
