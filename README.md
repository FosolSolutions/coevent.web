# CoEvent Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

CoEvent is a flexible scheduling solution for teams and organizations.

The web application provides a UI for users.

## Containers

The web application is comprised of the following Docker containers;

| Service                              | Platform      | Description            |
| ------------------------------------ | ------------- | ---------------------- |
| [app](./app/README.md)               | React         | Client web application |
| [api](./api/README.md)               | .NET Core 3.1 | RESTful API endpoints  |
| [database](./api/db/mssql/README.md) | MSSQL 2019    | Relational database    |

## Setup

Clone the repo, run the setup script and start developing!

### Environment

You will need the following installed on your local machine.

| Tool                                                                                             | OS  |  Version | Description                                                                                         |
| ------------------------------------------------------------------------------------------------ | :-: | -------: | --------------------------------------------------------------------------------------------------- |
| [Docker Desktop](https://www.docker.com/products/docker-desktop)                                 | \*  |          | Docker Desktop is required for running the solution in containers                                   |
| [node](https://www.npmjs.com/get-npm)                                                            | \*  | v10.16.0 | Required for building and running React application                                                 |
| npm                                                                                              | \*  |    6.9.0 | Required for node packages managemen                                                                |
| [GitBash](https://git-scm.com/downloads)                                                         | WIN |          | Required for `bash` scripts                                                                         |
| [coreutils](https://formulae.brew.sh/formula/coreutils)                                          | MAC |          | Required for scripts                                                                                |
| make                                                                                             | \*  |          | Required for `make` scripts. Windows can install with [Chocolately](https://chocolatey.org/install) |
| [.NET Core 3.1 SDK](https://docs.microsoft.com/en-us/dotnet/core/install/windows?tabs=netcore31) | \*  |      3.1 | Required for running `dotnet` commands                                                              |
| [Entity Framework Core Tools](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet) | \*  |          | Required for running `dotnet ef` commands for database migrations                                   |

> At some point these dependencies will be containerized and remove the need to install them locally.

Follow the steps to setup your local environment below;

### Clone Repository

Get a clone of the repository.

```bash
git clone --recurse-submodules https://github.com/fosolsolutions/coevent.web.git
```

### Generate an SSL Certificate

The API enforces HTTPS so you will need to generate the appropriate certification and place it in `/api/certs/aspnetcore.pfx`.
If you run into issues, it is possible to not enforce HTTPS and allow HTTP instead.

For more information read Microsofts [docs](https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-3.1&tabs=visual-studio).

> Linux based OS may require something different.

For Windows do the following;

```bash
# Tell your computer to trust self-signed developer certificates.
dotnet dev-certs https --trust

# Create a self-signed certificate
dotnet dev-certs https -ep ./api/certs/aspnetcore.pfx -p {<crptic-password>}
```

### Setup Environment

This script will generate `.env` files so that each container will function correctly.
It will then build the containers, start the **database** and initialize it.
Finally it will spin up the **api** and **app** containers.

When running this script it will ask you to enter a `username` for the database you would like to initialize with.
It will also ask you for the `password` you entered when generating your self-signed certificate.
The script will randomly generate other passwords and secrets and place them into the created `.env` files.
If you want to manually choose your own passwords, you will need to modify the `.env` files and re-initialize your containers.
Once the script completes successfully you will have a working environment - [https://localhost:3000](https://localhost:3000).

```bash
make setup
```

### Development

The React application is setup to hot-load whenever you make changes to the source code.
If you make changes to the node packages, you will need to `make clean-npm` and then `make up` to reinitiaze the **node_modules** **volume**.

The API will need to be rebuilt any time you make a change. You can do this with `make rebuild n=api`.

If you want help with the `make` commands, type `make help`.
You don't need to use `make`, you can instead use manually use `docker-compose` instead.
