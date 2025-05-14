# TCP Multi-Client IP Address Validator

This project implements a multi-client TCP server that validates IPv4 addresses. Clients can connect to the server and send IPv4 addresses for validation. The server verifies whether each address is valid and sends back "YES" or "NO" as a result to the client.

## Features

- Multi-client support using threads
- IPv4 address validation
- Graceful server shutdown when all clients exit
- Simple client interface

## Components

The project consists of three files:
- `custom.h`: Header file containing common definitions and includes
- `server.c`: Multi-threaded server implementation that validates IPv4 addresses
- `client.c`: Client implementation that sends IPv4 addresses and displays results

## How to Compile

To compile the server and client programs, use the following commands:

```bash
gcc -o server server.c -lpthread
gcc -o client client.c
```

Note: The `-lpthread` flag is required for the server to link the POSIX threads library.

## How to Run

1. First, start the server:
   ```bash
   ./server
   ```

2. Then, in another terminal, start one or more clients:
   ```bash
   ./client
   ```

3. The client will prompt you to enter an IPv4 address (e.g., 192.168.1.1).

4. The server will validate the address and send back "YES" if it's valid or "NO" if it's invalid.

5. To exit a client, enter "exit".

6. When all clients have exited, the server will automatically shut down.

## Example Usage

```
Enter the IPv4 address (or 'exit' to quit): 192.168.1.1
Result: YES

Enter the IPv4 address (or 'exit' to quit): 256.168.1.1
Result: NO

Enter the IPv4 address (or 'exit' to quit): 192.168.1
Result: NO

Enter the IPv4 address (or 'exit' to quit): exit
```

## Implementation Details

- The server listens on port 8888 by default.
- The client connects to the server on localhost (127.0.0.1) by default.
- The server uses POSIX threads to handle multiple clients simultaneously.
- The server uses the `inet_pton()` function to validate IPv4 addresses.
- A mutex is used to protect the shared `active_clients` counter.
- The server automatically shuts down when all clients have exited.

## IPv4 Address Validation

The server validates IPv4 addresses using the `inet_pton()` function, which converts an IPv4 address from text to binary form. If the conversion succeeds, the address is valid; otherwise, it's invalid.

Valid IPv4 addresses must:
- Contain four decimal numbers separated by dots
- Each number must be between 0 and 255
- No leading zeros are allowed
- No extra characters are allowed
