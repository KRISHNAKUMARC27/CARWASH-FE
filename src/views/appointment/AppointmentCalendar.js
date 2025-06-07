import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const localizer = momentLocalizer(moment);

const AppointmentCalendar = ({ appointments, setAppointment, setAppointmentUpdateOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const events = appointments.map((appt) => ({
    title: `${appt.customerName} - ${appt.service}`,
    start: new Date(appt.appointmentDateTime),
    end: new Date(new Date(appt.appointmentDateTime).getTime() + 60 * 60 * 1000),
    resource: appt
  }));

  const handleSelectEvent = (event) => {
    setAppointment(event.resource);
    setAppointmentUpdateOpen(true);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = 'blue';
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
    <Box
      sx={{
        width: '100%',
        height: isMobile ? '70vh' : '80vh',
        overflow: 'hidden',
        px: { xs: 1, sm: 2 },
        py: 2
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day', 'agenda']}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        style={{ height: '100%', width: '100%' }}
      />
    </Box>
  );
};

AppointmentCalendar.propTypes = {
  appointments: PropTypes.array,
  setAppointment: PropTypes.func.isRequired,
  setAppointmentUpdateOpen: PropTypes.func.isRequired
};

export default AppointmentCalendar;
