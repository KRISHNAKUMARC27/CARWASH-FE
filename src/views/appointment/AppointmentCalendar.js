import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import PropTypes from 'prop-types';

const localizer = momentLocalizer(moment);

const AppointmentCalendar = ({ appointments, setAppointment, setAppointmentUpdateOpen }) => {
  const events = appointments.map((appt) => ({
    title: `${appt.customerName} - ${appt.service}`,
    start: new Date(appt.appointmentDateTime),
    end: new Date(new Date(appt.appointmentDateTime).getTime() + 60 * 60 * 1000), // 1-hour event
    resource: appt // Store the entire appointment object
  }));

  const handleSelectEvent = (event) => {
    setAppointment(event.resource); // Set the selected appointment
    setAppointmentUpdateOpen(true); // Open the dialog
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = 'blue'; // Default color for SCHEDULED
    switch (event.resource.status) {
      case 'IN-PROGRESS':
        backgroundColor = 'orange';
        break;
      case 'COMPLETED':
        backgroundColor = 'green';
        break;
      case 'CANCELLED':
        backgroundColor = 'red';
        break;
      default:
        break;
    }
    return {
      style: { backgroundColor }
    };
  };

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day', 'agenda']}
        onSelectEvent={handleSelectEvent} // Add event handler
        eventPropGetter={eventStyleGetter} // Add event style getter
      />
    </div>
  );
};

AppointmentCalendar.propTypes = {
  appointments: PropTypes.array,
  setAppointment: PropTypes.func.isRequired,
  setAppointmentUpdateOpen: PropTypes.func.isRequired
};

export default AppointmentCalendar;
