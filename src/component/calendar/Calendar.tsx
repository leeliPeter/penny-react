import React, { useState } from "react";
import "./calendar.css";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function Calendar() {
  // State to hold the selected date
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  // Function to handle the date change
  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    console.log("Picked date:", newDate?.format("YYYY-MM-DD")); // Return the picked date
  };

  return (
    <div className="datepicker">
      <div className="container">
        <p className="picked-date">
          Picked Date:{" "}
          {selectedDate ? selectedDate.format("YYYY-MM-DD") : "None"}
        </p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateCalendar", "DateCalendar"]}>
            <DemoItem>
              <DateCalendar
                defaultValue={selectedDate}
                onChange={handleDateChange} // Handle the date change
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      </div>
    </div>
  );
}
