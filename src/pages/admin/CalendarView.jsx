import React, { useState, useEffect } from 'react';
import { getIncidents, getPatients } from '../../services/storageService';

const CalendarView = () => {
	const [allAppointments, setAllAppointments] = useState([]);
	const [patientList, setPatientList] = useState([]);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [viewMode, setViewMode] = useState('month'); // can be 'month' or 'week'
	const [pickedDay, setPickedDay] = useState(null);

	useEffect(() => {
		fetchMyData();
	}, []);

	// just loading all the data at once - could optimize later
	const fetchMyData = () => {
		const tempIncidents = getIncidents();
		const tempPatients = getPatients();
		setAllAppointments(tempIncidents);
		setPatientList(tempPatients);
	}

	const findPatientName = (id) => {
		let res = null;
		for (let i = 0; i < patientList.length; i++) {
			if (patientList[i].id === id) {
				res = patientList[i];
				break;
			}
		}
		return res ? res.name : 'Unknown Patient';
	}

	const buildMonthGrid = () => {
		const yr = currentDate.getFullYear();
		const mo = currentDate.getMonth();
		const firstDayOfMonth = new Date(yr, mo, 1);
		const lastDayOfMonth = new Date(yr, mo + 1, 0);
		const startCalendarDate = new Date(firstDayOfMonth);
		startCalendarDate.setDate(startCalendarDate.getDate() - firstDayOfMonth.getDay());
		const daysArray = [];
		const walker = new Date(startCalendarDate);
		while (walker <= lastDayOfMonth || walker.getDay() !== 0) {
			daysArray.push(new Date(walker));
			walker.setDate(walker.getDate() + 1);
		}
		return daysArray;
	}

	const buildWeekGrid = () => {
		const weekStart = new Date(currentDate);
		weekStart.setDate(currentDate.getDate() - currentDate.getDay());
		const weekDays = [];
		for (let idx = 0; idx < 7; idx++) {
			const tempDay = new Date(weekStart);
			tempDay.setDate(weekStart.getDate() + idx);
			weekDays.push(tempDay);
		}
		return weekDays;
	}

	const findAppointmentsForDay = (targetDate) => {
		const targetStr = targetDate.toDateString();
		const matchingAppts = [];
		
		// using traditional loop instead of filter - easier to debug 
		for (let i = 0; i < allAppointments.length; i++) {
			const apptDate = new Date(allAppointments[i].appointmentDate);
			if (apptDate.toDateString() === targetStr) {
				matchingAppts.push(allAppointments[i]);
			}
		}
		return matchingAppts;
	}

	const goToNextMonth = () => {
		const nextDate = new Date(currentDate);
		nextDate.setMonth(currentDate.getMonth() + 1);
		setCurrentDate(nextDate);
	}

	const goToPrevMonth = () => {
		const prevDate = new Date(currentDate);
		prevDate.setMonth(currentDate.getMonth() - 1);
		setCurrentDate(prevDate);
	}

	const goToNextWeek = () => {
		const nextWeek = new Date(currentDate);
		nextWeek.setDate(currentDate.getDate() + 7);
		setCurrentDate(nextWeek);
	}

	const goToPrevWeek = () => {
		const prevWeek = new Date(currentDate);
		prevWeek.setDate(currentDate.getDate() - 7);
		setCurrentDate(prevWeek);
	}

	const onDayClick = (clickedDate) => {
		setPickedDay(clickedDate);
	}

	// could move this to a constants file but whatever
	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const renderMonthCalendar = () => {
		const monthDays = buildMonthGrid();
		const headerCells = [];
		const dayCells = [];
		for (let i = 0; i < dayLabels.length; i++) {
			headerCells.push(
				<div key={dayLabels[i]} className="p-2 text-center font-medium text-gray-500 bg-gray-50">
					{dayLabels[i]}
				</div>
			);
		}

		// build calendar days
		for (let j = 0; j < monthDays.length; j++) {
			const dayDate = monthDays[j];
			const dailyAppts = findAppointmentsForDay(dayDate);
			const belongsToCurrentMonth = dayDate.getMonth() === currentDate.getMonth();
			const isTodaysDate = dayDate.toDateString() === new Date().toDateString();
			let cellClasses = 'min-h-24 p-1 border cursor-pointer hover:bg-gray-50 ';
			if (belongsToCurrentMonth) {
				cellClasses += 'bg-white ';
			} else {
				cellClasses += 'bg-gray-100 text-gray-400 ';
			}
			if (isTodaysDate) {
				cellClasses += 'bg-blue-50 border-blue-200 ';
			} else {
				cellClasses += 'border-gray-200 ';
			}
			const apptElements = [];
			const maxVisible = 2;
			for (let k = 0; k < Math.min(dailyAppts.length, maxVisible); k++) {
				const appt = dailyAppts[k];
				const timeStr = new Date(appt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
				const patName = findPatientName(appt.patientId); // calling this inside loop - not ideal but works
				apptElements.push(
					<div key={appt.id} className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate">
						{timeStr} - {patName}
					</div>
				);
			}
			if (dailyAppts.length > maxVisible) {
				apptElements.push(
					<div key="overflow" className="text-xs text-gray-500">
						+{dailyAppts.length - maxVisible} more
					</div>
				);
			}
			dayCells.push(
				<div
					key={j}
					className={cellClasses}
					onClick={() => onDayClick(dayDate)}
				>
					<div className={`text-sm ${isTodaysDate ? 'font-bold text-blue-600' : ''}`}>
						{dayDate.getDate()}
					</div>
					<div className="space-y-1">
						{apptElements}
					</div>
				</div>
			);
		}
		return (
			<div className="grid grid-cols-7 gap-1">
				{headerCells}
				{dayCells}
			</div>
		);
	}

	const renderWeekCalendar = () => {
		const weekDays = buildWeekGrid();
		const weekCells = [];
		for (let i = 0; i < weekDays.length; i++) {
			const dayDate = weekDays[i];
			const dailyAppts = findAppointmentsForDay(dayDate);
			const isTodaysDate = dayDate.toDateString() === new Date().toDateString();
			let cellClasses = 'min-h-48 p-2 border cursor-pointer hover:bg-gray-50 ';
			if (isTodaysDate) {
				cellClasses += 'bg-blue-50 border-blue-200 ';
			} else {
				cellClasses += 'bg-white border-gray-200 ';
			}
			const apptElements = [];
			for (let j = 0; j < dailyAppts.length; j++) {
				const appt = dailyAppts[j];
				const timeStr = new Date(appt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
				const patName = findPatientName(appt.patientId);
				apptElements.push(
					<div key={appt.id} className="text-xs p-1 rounded bg-blue-100 text-blue-800">
						<div className="font-medium">{timeStr}</div>
						<div>{patName}</div>
						<div className="truncate">{appt.title}</div>
					</div>
				);
			}
			weekCells.push(
				<div
					key={i}
					className={cellClasses}
					onClick={() => onDayClick(dayDate)}
				>
					<div className={`text-sm font-medium mb-2 ${isTodaysDate ? 'text-blue-600' : ''}`}>
						{dayLabels[dayDate.getDay()]} {dayDate.getDate()}
					</div>
					<div className="space-y-1">
						{apptElements}
					</div>
				</div>
			);
		}
		return (
			<div className="grid grid-cols-7 gap-1">
				{weekCells}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
					<p className="text-gray-600">View appointments by month or week</p>
				</div>
				<div className="flex space-x-2">
					<button
						onClick={() => setViewMode('month')}
						className={`px-3 py-1 rounded ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
					>
						Month
					</button>
					<button
						onClick={() => setViewMode('week')}
						className={`px-3 py-1 rounded ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
					>
						Week
					</button>
				</div>
			</div>

			{/* Navigation stuff */}
			<div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
				<button
					onClick={() => viewMode === 'month' ? goToPrevMonth() : goToPrevWeek()}
					className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
				>
					←
				</button>
				<h2 className="text-xl font-semibold">
					{(() => {
						if (viewMode === 'month') {
							const monthName = monthNames[currentDate.getMonth()];
							const year = currentDate.getFullYear();
							return `${monthName} ${year}`;
						} else {
							// this is kind of inefficient but whatever 
							const weekStart = buildWeekGrid()[0];
							return `Week of ${weekStart.toLocaleDateString()}`;
						}
					})()}
				</h2>
				<button
					onClick={() => viewMode === 'month' ? goToNextMonth() : goToNextWeek()}
					className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
				>
					→
				</button>
			</div>

			{/* Main calendar area */}
			<div className="bg-white rounded-lg shadow">
				{viewMode === 'month' ? renderMonthCalendar() : renderWeekCalendar()}
			</div>

			{/* show details for selected day */}
			{pickedDay && (
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-medium mb-4">
						Appointments for {pickedDay.toLocaleDateString()}
					</h3>
					
					{(() => {
						const dayAppts = findAppointmentsForDay(pickedDay);
						if (dayAppts.length > 0) {
							const apptCards = [];
							for (let i = 0; i < dayAppts.length; i++) {
								const appt = dayAppts[i];
								const timeStr = new Date(appt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
								const patName = findPatientName(appt.patientId);
								
								let statusStyles = 'inline-flex px-2 py-1 text-xs rounded-full ';
								if (appt.status === 'Scheduled') {
									statusStyles += 'bg-yellow-100 text-yellow-800';
								} else if (appt.status === 'Completed') {
									statusStyles += 'bg-green-100 text-green-800';
								} else if (appt.status === 'Cancelled') {
									statusStyles += 'bg-red-100 text-red-800';
								} else {
									statusStyles += 'bg-gray-100 text-gray-800';
								}
								apptCards.push(
									<div key={appt.id} className="border rounded p-3">
										<div className="flex justify-between items-start">
											<div>
												<p className="font-medium">{patName}</p>
												<p className="text-sm text-gray-600">{appt.title}</p>
												<p className="text-sm text-gray-500">{appt.description}</p>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium">{timeStr}</p>
												<span className={statusStyles}>
													{appt.status}
												</span>
											</div>
										</div>
									</div>
								);
							}
							return (
								<div className="space-y-3">
									{apptCards}
								</div>
							);
						} else {
							return <p className="text-gray-500">No appointments scheduled for this day.</p>;
						}
					})()}
				</div>
			)}
		</div>
	);
}

export default CalendarView;
