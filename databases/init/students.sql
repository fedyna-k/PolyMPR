create table promotions (
  id      integer primary key autoincrement,
  endyear integer,
  current integer
);

create table students (
  userId    text  primary key,
  firstName text,
  lastName  text,
  mail      text,
  promo     integer,
  foreign key(promo) references promo(id)
);