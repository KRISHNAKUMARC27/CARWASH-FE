import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';

const CategoryAccordion = ({ title, jobTitle, data, valueKey }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {Object.entries(data).map(([category, items]) => (
        <Accordion key={category}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{jobTitle}</TableCell>
                  <TableCell align="right">{valueKey.toUpperCase()}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.sparesAndLabour}</TableCell>
                    <TableCell align="right">{item[valueKey]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

CategoryAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  jobTitle: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  valueKey: PropTypes.object.isRequired
};

export default CategoryAccordion;
