# cration migration and apply this migration in DBMS (SGBD) and generate in PrismaClient
prisma migrate dev

# apply migrations if there is some migrations don't applied
prisma migrate deploy

# generate in PrismaClient
prisma generate

# delete old apllies and reset (apply migrations + generate + seed )
prisma migrate reset

# show my database in browser
prisma studio

# runing seed file (ajouter data inside database 'postgres' )
prisma db seed or yarn run seed