import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import PropTypes from 'prop-types';

const localizer = momentLocalizer(moment);

const AppointmentCalendar = ({ appointments }) => {
  const events = appointments.map((appt) => ({
    title: `${appt.customerName} - ${appt.service}`,
    start: new Date(appt.appointmentDateTime),
    end: new Date(new Date(appt.appointmentDateTime).getTime() + 60 * 60 * 1000) // 1-hour event
  }));

  return (
    <div style={{ height: 600 }}>
      <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" views={['month', 'week', 'day', 'agenda']} />
    </div>
  );
};

AppointmentCalendar.propTypes = {
  appointments: PropTypes.array
};
export default AppointmentCalendar;
