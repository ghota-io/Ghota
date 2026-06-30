import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import GhotaNavbar from '@/Components/GhotaNavbar';

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function Calendar({ events }) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    };

    const eventsForDate = (day) =>
        events.filter((e) => {
            const d = new Date(e.starts_at);
            return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push({ day: prevMonthDays - firstDay + 1 + i, muted: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, muted: false, isToday: i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() });
    }
    const remaining = 42 - calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
        calendarDays.push({ day: i, muted: true });
    }

    return (
        <>
            <Head title="Calendário" />

            <div className="min-h-screen bg-white dark:bg-[#1e1f22] flex flex-col">
                <GhotaNavbar />

                <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-5 py-6 gap-6">
                    {/* Left — Event list */}
                    <div className="lg:w-80 xl:w-96 shrink-0">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Eventos</h2>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{months[currentMonth]} {currentYear}</span>
                        </div>

                        <div className="space-y-3">
                            {events.length > 0 ? (
                                events.map((event) => {
                                    const d = new Date(event.starts_at);
                                    return (
                                        <div
                                            key={event.id}
                                            className="flex items-start gap-3 bg-white dark:bg-[#2b2d31] rounded-xl border border-gray-200 dark:border-[#1e1f22] p-4 hover:border-indigo-200 dark:hover:border-indigo-700 transition cursor-pointer"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-lg flex flex-col items-center justify-center text-white shrink-0"
                                                style={{ backgroundColor: event.color || '#6366f1' }}
                                            >
                                                <span className="text-[10px] leading-none font-medium">{months[d.getMonth()].slice(0, 3)}</span>
                                                <span className="text-sm leading-none font-bold">{d.getDate()}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                    {event.title}
                                                </h3>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                    {event.community?.name} · {d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-gray-50 dark:bg-[#232428] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-10 text-center">
                                    <CalendarDays className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum evento agendado.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right — Calendar grid */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-5 lg:p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5 text-indigo-500" />
                                    EVENTOS / CALENDÁRIO
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={prevMonth}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3c43] text-gray-500 dark:text-gray-400 transition"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[140px] text-center">
                                        {months[currentMonth]} {currentYear}
                                    </span>
                                    <button
                                        onClick={nextMonth}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3c43] text-gray-500 dark:text-gray-400 transition"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Weekday headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {weekdays.map((d) => (
                                    <div
                                        key={d}
                                        className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-2"
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Days grid */}
                            <div className="grid grid-cols-7">
                                {calendarDays.map((cell, i) => {
                                    const evts = eventsForDate(cell.day);
                                    return (
                                        <div
                                            key={i}
                                            className={`min-h-[80px] lg:min-h-[100px] border border-gray-100 dark:border-[#1e1f22] p-1.5 lg:p-2 transition ${
                                                cell.muted
                                                    ? 'bg-gray-50/50 dark:bg-[#232428]/50'
                                                    : 'bg-white dark:bg-[#2b2d31]'
                                            }`}
                                        >
                                            <span
                                                className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${
                                                    cell.isToday
                                                        ? 'bg-indigo-600 text-white font-bold'
                                                        : cell.muted
                                                          ? 'text-gray-300 dark:text-gray-600'
                                                          : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {cell.day}
                                            </span>
                                            <div className="mt-1 space-y-0.5">
                                                {evts.slice(0, 2).map((ev) => (
                                                    <div
                                                        key={ev.id}
                                                        className="text-[10px] leading-tight px-1 py-0.5 rounded truncate cursor-pointer hover:bg-opacity-80 transition"
                                                        style={{
                                                            backgroundColor: (ev.color || '#6366f1') + '20',
                                                            color: ev.color || '#6366f1',
                                                        }}
                                                    >
                                                        {ev.title}
                                                    </div>
                                                ))}
                                                {evts.length > 2 && (
                                                    <div className="text-[10px] text-gray-400 dark:text-gray-500 px-1">
                                                        +{evts.length - 2} mais
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
