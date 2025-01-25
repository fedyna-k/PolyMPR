CREATE TABLE mobility (
    id                  integer primary key autoincrement,
    studentId           text,
    startDate           date,
    endDate             date,
    weeksCount          integer,
    destinationCountry  text,
    destinationName     text,
    mobilityStatus      text default 'N/A',
    foreign key (studentId) references students(userId)
);