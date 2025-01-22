create table promotions (
  id      integer primary key autoincrement,
  name text,
  endyear integer,
  current integer
);

create table students (
  userId    text  primary key,
  firstName text,
  lastName  text,
  mail      text,
  promotionId     integer,
  foreign key(promotionId) references promotions(id)
);