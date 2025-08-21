# cration migration and apply this migration in DBMS (SGBD) and generate in PrismaClient
prisma migrate dev --name

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

# Delete all migration history
rm -rf prisma/migrations

# Open interactive DB GUI
npx prisma studio

# Validate your Prisma schema
npx prisma validate

# Restore the missing file
ls migrations/


git log -- prisma/migrations
# or
git log -- migrations

# after 
git checkout <commit_id> -- migrations/


npx prisma format





