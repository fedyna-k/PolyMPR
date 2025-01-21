create table students (
  userId    text  primary key,
  firstName text,
  lastName  text,
  mail      text,
  promo     integer,
  foreign key(promo) references promo(id)
);

create table promo (
  id      integer,
  endyear integer,
  current integer
);