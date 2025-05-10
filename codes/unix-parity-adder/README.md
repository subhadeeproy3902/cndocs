# Unix Parity Adder

This project implements a simple client-server application using Unix File sockets. The client takes a bit-stream from the user and sends it to the server. The server adds a parity bit to the bit-stream and sends the modified bit-stream back to the client. The client then displays the result.

## Problem Statement

Write C Programs to implement a simple client-server application using Unix File socket. The client will take a bit-stream from the user and send it to server. The server will add a parity bit to it and send the modified bit-stream to the corresponding client. The client will print the result.

## Overview

The system consists of two programs that communicate through a Unix domain socket:

1. **Client (Client.c)**: Takes bit-stream input from the user and sends it to the server
2. **Server (Server.c)**: Receives the bit-stream, adds a parity bit, and sends it back to the client

## Components

### Client Program (Client.c)

The client program connects to the server using a Unix domain socket and handles the user interaction.

Key features:

- Creates a socket connection to the server
- Takes bit-stream input from the user
- Sends the bit-stream to the server
- Receives the modified bit-stream with the parity bit
- Displays the result to the user
- Terminates when the user enters "end"

### Server Program (Server.c)

The server program listens for client connections, processes the bit-stream, and adds a parity bit.

Key features:

- Creates a Unix domain socket and listens for connections
- Accepts client connections
- Receives bit-streams from clients
- Calculates and adds an even parity bit to the bit-stream
- Sends the modified bit-stream back to the client
- Terminates when it receives "end" from the client

## Parity Bit Calculation

The server calculates an even parity bit for the received bit-stream:

1. It counts the number of '1' bits in the input stream
2. If the count is even, it adds '0' as the parity bit
3. If the count is odd, it adds '1' as the parity bit

This ensures that the total number of '1' bits (including the parity bit) is always even, which is the principle of even parity.

## Compilation and Execution

To compile the programs:

```bash
gcc -o server Server.c
gcc -o client Client.c
```

To run the system, open two terminal windows and execute:

```bash
# Terminal 1
./server

# Terminal 2
./client
```

Enter bit-streams in the client terminal. The server will add a parity bit and send the modified bit-stream back to the client. Enter "end" to terminate both programs.

## Implementation Details

- The system uses Unix domain sockets (AF_UNIX) for inter-process communication
- The socket path is set to "a2server"
- The client and server communicate using SOCK_STREAM (TCP-like) socket type
- The server adds an even parity bit to ensure the total number of '1' bits is even
- Both programs handle termination gracefully when "end" is received