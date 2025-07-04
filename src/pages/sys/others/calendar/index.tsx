import { down, useMediaQuery } from "@/hooks";
import { useSettings } from "@/store/settingStore";
import { Card, CardContent } from "@/ui/card";
import { faker } from "@faker-js/faker";
import type { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CalendarEvent from "./calendar-event";
import CalendarEventForm, { type CalendarEventFormFieldType } from "./calendar-event-form";
import CalendarHeader, { type HandleMoveArg, type ViewType } from "./calendar-header";
import { INITIAL_EVENTS } from "./event-utils";
import { StyledCalendar } from "./styles";

const DefaultEventInitValue = {
	id: faker.string.uuid(),
	title: "",
	description: "",
	allDay: false,
	start: dayjs(),
	end: dayjs(),
	color: "",
};
export default function Calendar() {
	const fullCalendarRef = useRef<FullCalendar>(null);
	const [view, setView] = useState<ViewType>("dayGridMonth");
	const [date, setDate] = useState(new Date());
	const [open, setOpen] = useState(false);
	const [eventInitValue, setEventInitValue] = useState<CalendarEventFormFieldType>(DefaultEventInitValue);
	const [eventFormType, setEventFormType] = useState<"add" | "edit">("add");

	const { themeMode } = useSettings();
	const xsBreakPoint = useMediaQuery(down("xs"));

	useEffect(() => {
		if (xsBreakPoint) {
			setView("listWeek");
		}
	}, [xsBreakPoint]);
	/**
	 * calendar header events
	 */
	const handleMove = (action: HandleMoveArg) => {
		const calendarApi = fullCalendarRef.current?.getApi();
		if (!calendarApi) return;
		switch (action) {
			case "prev":
				calendarApi.prev();
				break;
			case "next":
				calendarApi.next();
				break;
			case "today":
				calendarApi.today();
				break;
			default:
				break;
		}
		setDate(calendarApi.getDate());
	};
	const handleViewTypeChange = (view: ViewType) => {
		setView(view);
	};

	useLayoutEffect(() => {
		const calendarApi = fullCalendarRef.current?.getApi();
		if (!calendarApi) return;
		setTimeout(() => {
			calendarApi.changeView(view);
		});
	}, [view]);

	/**
	 * calendar grid events
	 */
	// select date range
	const handleDateSelect = (selectInfo: DateSelectArg) => {
		const calendarApi = selectInfo.view.calendar;
		calendarApi.unselect(); // clear date selection
		setOpen(true);
		setEventFormType("add");
		setEventInitValue({
			id: faker.string.uuid(),
			title: "",
			description: "",
			start: dayjs(selectInfo.startStr),
			end: dayjs(selectInfo.endStr),
			allDay: selectInfo.allDay,
		});
	};

	/**
	 * calendar event events
	 */
	// click event and open modal
	const handleEventClick = (arg: EventClickArg) => {
		const { title, extendedProps, allDay, start, end, backgroundColor, id } = arg.event;
		setOpen(true);
		setEventFormType("edit");
		const newEventValue: CalendarEventFormFieldType = {
			id,
			title,
			allDay,
			color: backgroundColor,
			description: extendedProps.description,
		};
		if (start) {
			newEventValue.start = dayjs(start);
		}

		if (end) {
			newEventValue.end = dayjs(end);
		}
		setEventInitValue(newEventValue);
	};
	const handleCancel = () => {
		setEventInitValue(DefaultEventInitValue);
		setOpen(false);
	};
	// edit event
	const handleEdit = (values: CalendarEventFormFieldType) => {
		const { id, title = "", description, start, end, allDay = false, color } = values;
		const calendarApi = fullCalendarRef.current?.getApi();
		if (!calendarApi) return;
		const oldEvent = calendarApi.getEventById(id);

		const newEvent: EventInput = {
			id,
			title,
			allDay,
			color,
			extendedProps: {
				description,
			},
		};
		if (start) newEvent.start = start.toDate();
		if (end) newEvent.end = end.toDate();

		// 刷新日历显示
		oldEvent?.remove();
		calendarApi.addEvent(newEvent);
	};
	// create event
	const handleCreate = (values: CalendarEventFormFieldType) => {
		const calendarApi = fullCalendarRef.current?.getApi();
		if (!calendarApi) return;
		const { title = "", description, start, end, allDay = false, color } = values;

		const newEvent: EventInput = {
			id: faker.string.uuid(),
			title,
			allDay,
			color,
			extendedProps: {
				description,
			},
		};
		if (start) newEvent.start = start.toDate();
		if (end) newEvent.end = end.toDate();

		// 刷新日历显示
		calendarApi.addEvent(newEvent);
	};
	// delete event
	const handleDelete = (id: string) => {
		const calendarApi = fullCalendarRef.current?.getApi();
		if (!calendarApi) return;
		const oldEvent = calendarApi.getEventById(id);
		oldEvent?.remove();
	};

	return (
		<>
			<Card className="h-full w-full">
				<CardContent className="h-full w-full">
					<StyledCalendar $themeMode={themeMode}>
						<CalendarHeader
							now={date}
							view={view}
							onMove={handleMove}
							onCreate={() => setOpen(true)}
							onViewTypeChange={handleViewTypeChange}
						/>
						<FullCalendar
							ref={fullCalendarRef}
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
							initialDate={date}
							initialView={xsBreakPoint ? "listWeek" : view}
							events={INITIAL_EVENTS}
							eventContent={CalendarEvent}
							editable
							selectable
							selectMirror
							dayMaxEvents
							headerToolbar={false}
							select={handleDateSelect}
							eventClick={handleEventClick}
						/>
					</StyledCalendar>
				</CardContent>
			</Card>
			<CalendarEventForm
				open={open}
				type={eventFormType}
				initValues={eventInitValue}
				onCancel={handleCancel}
				onDelete={handleDelete}
				onCreate={handleCreate}
				onEdit={handleEdit}
			/>
		</>
	);
}
