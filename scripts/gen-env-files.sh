# Enter the DB username you want to initialize the database with.
echo 'Enter a username for the API database.'
read -p 'Username: ' dbUsername

echo 'Enter the password for your SSL certificate you generated.'
read -p 'Password: ' sslPassword

# Generate a random password.
dbPassword=$(date +%s | sha256sum | base64 | head -c 32)
salt=$(date +%s | sha256sum | base64 | head -c 32)
secret=$(date +%s | sha256sum | base64 | head -c 32)

# Set environment variables.
if test -f "./api/db/mssql/.env"; then
    echo "./api/db/mssql/.env exists"
else
echo \
"ACCEPT_EULA=Y
MSSQL_SA_PASSWORD=$dbPassword
MSSQL_PID=Developer
TZ=America/Los_Angeles
DB_NAME=coevent
DB_USER=$dbUsername
DB_PASSWORD=$dbPassword
TIMEOUT_LENGTH=120" >> ./api/db/mssql/.env
fi

if test -f "./api/src/.env"; then
    echo "./api/src/.env exists"
else
echo \
"ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=https://*:443;http://*:80

Cors__WithOrigins=http://localhost:3000 https://localhost:3000

# HTTPS settings
ASPNETCORE_Kestrel__Certificates__Default__Path=/root/https/aspnetcore.pfx
ASPNETCORE_Kestrel__Certificates__Default__Password=$sslPassword

# JWT settings
Authentication__Issuer=https://localhost:10443/
Authentication__Audience=https://localhost:10443/
Authentication__Salt=$salt
Authentication__Secret=$secret

# Database settings
ConnectionStrings__ApiData=SERVER=database,1433;DATABASE=coevent;
DB_USERID=$dbUsername
DB_PASSWORD=$dbPassword

# SMTP settings
Mail__Host=smtp.ethereal.email
Mail__Port=587
Mail__Name=Jamey Pfeffer
Mail__Username=jamey80@ethereal.email
Mail__Password=
Mail__FromEmail=contact@victoriabiblestudy.com" >> ./api/src/.env
fi

if test -f "./api/src/.vs.env"; then
    echo "./api/src/.vs.env exists"
else
echo \
"ASPNETCORE_ENVIRONMENT=VS
ASPNETCORE_URLS=https://*:10443;http://*:1080

Cors__WithOrigins=http://localhost:3000 https://localhost:3000

# HTTPS settings
ASPNETCORE_Kestrel__Certificates__Default__Path=../certs/aspnetcore.pfx
ASPNETCORE_Kestrel__Certificates__Default__Password=$sslPassword

# JWT settings
Authentication__Issuer=https://localhost:10443/
Authentication__Audience=https://localhost:10443/
Authentication__Salt=$salt
Authentication__Secret=$secret

# Database settings
ConnectionStrings__ApiData=SERVER=localhost,5433;DATABASE=coevent;
DB_USERID=$dbUsername
DB_PASSWORD=$dbPassword

# SMTP settings
Mail__Host=smtp.ethereal.email
Mail__Port=587
Mail__Name=Jamey Pfeffer
Mail__Username=jamey80@ethereal.email
Mail__Password=
Mail__FromEmail=contact@victoriabiblestudy.com
Mail__ContactEmail=jeremymfoster@hotmail.com" >> ./api/src/.vs.env
fi

if test -f "./api/libs/Data/.env"; then
    echo "./api/libs/Data/.env exists"
else
echo \
"ASPNETCORE_ENVIRONMENT=Development
DB_USERID=$dbUsername
DB_PASSWORD=$dbPassword
ConnectionStrings__ApiData=SERVER=localhost,5433;DATABASE=coevent;" >> ./api/libs/Data/.env
fi

if test -f "./app/.env"; then
    echo "./app/.env exists"
else
echo \
"NODE_ENV=Production
REACT_APP_API_URL=https://coeventapi.azurewebsites.net" >> ./app/.env
fi

if test -f "./app/.env.development"; then
    echo "./app/.env.development exists"
else
echo \
"NODE_ENV=Development
CHOKIDAR_USEPOLLING=true
REACT_APP_API_URL=https://localhost:10443" >> ./app/.env.development
fi
