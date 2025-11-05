# CFC OGD APP

## Pre-requisites

These files should be under your **data** directory

**members.csv** - This is the report from _Export Specific Field_ with the following fields checked LAST,FIRST,NICKNAME,BIRTHDAY,SEX,WEDDING,SPOUSE,MEMBERIDNO,CHAPTER,STATUS,SERVICE,HHHEAD,EMAIL,

**AttendanceReport.csv** - This is the csv export of Household Reports V2 --> Household Attendance Report, Just change the header row. Remove the YEAR example, `JAN 2025` to be just `JAN`

Now inside the **data** directory there is an **activities** subdirectory. Download all actvity attendance to this folder.

## Scripts

1. `docker compose up -d` : This commands starts up a mongo db docker container

2. `npm run setUp` : This sets up the mongo db databae

3. `npm run importMembers` : Imports the **members.csv** to the database

4. `npm run importAttendance` : Imports the **AttendanceReport.csv** file to the database

5. `npm run importActivities` : Imports all the activity files under the **data/activitites** subfolder

6. `npm run createHousehold` : Creates **data/householdList.csv** file where it will have the groupings and household attendance and activity attendance

7. `npm run forCocl` : Creates a report for COCL

8. `npm run noWeddingDate` : Created a report for members with no wedding date set.

9. `docker compose down -v` : This commands stops the mongo db docker container
