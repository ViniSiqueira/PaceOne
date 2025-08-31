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

const Routine = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
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
            setEvents(data);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar eventos");
        }
    };

    const handleAddEvent = (selectedDate) => {
        setForm({
            titulo: "",
            descricao: "",
            inicio: selectedDate,
            fim: selectedDate,
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
            const response = await fetch(`${API_BACKEND_URL}/api/rotina`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
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

    const eventsForSelectedDate = events.filter(
        (event) =>
            new Date(event.inicio).toLocaleDateString("pt-BR") ===
            date.toLocaleDateString("pt-BR")
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
                    onClickDay={(selectedDate) => handleAddEvent(selectedDate)}
                    locale="pt-BR"
                />
            </div>

            <h3 className="routine-events-title">
                Eventos do dia {date.toLocaleDateString()}
            </h3>
            {eventsForSelectedDate.length === 0 ? (
                <p>Não há eventos para este dia.</p>
            ) : (
                <ul className="routine-events-list">
                    {eventsForSelectedDate.map((event) => (
                        <li key={event.id} className="routine-event-item">
                            <div className="routine-event-info">
                                <strong>{event.titulo}</strong> —{" "}
                                {new Date(event.inicio).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}{" "}
                                às{" "}
                                {new Date(event.fim).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                <p>{event.descricao}</p>
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
                        <Button
                            label="Salvar"
                            icon="pi pi-check"
                            onClick={handleSave}
                            autoFocus
                        />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="title">Título*</label>
                        <InputText
                            id="title"
                            value={form.titulo}
                            onChange={(e) =>
                                setForm({ ...form, titulo: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="description">Descrição</label>
                        <InputTextarea
                            id="description"
                            value={form.descricao}
                            onChange={(e) =>
                                setForm({ ...form, descricao: e.target.value })
                            }
                            rows={3}
                        />
                    </div>

                    <div className="p-field">
                        <label>Data do evento*</label>
                        <InputText
                            type="date"
                            value={form.inicio ? form.inicio.toISOString().split("T")[0] : ""}
                            onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
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
                            onChange={(e) =>
                                setForm({ ...form, inicio: e.value })
                            }
                            showTime
                            timeOnly
                            hourFormat="24"
                        />
                    </div>

                    <div className="p-field">
                        <label>Hora final*</label>
                        <PrimeCalendar
                            value={form.fim}
                            onChange={(e) =>
                                setForm({ ...form, fim: e.value })
                            }
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
