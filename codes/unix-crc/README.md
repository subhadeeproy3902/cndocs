# CRC Client-Server Application Using Unix File Sockets

This project implements a simple client-server application that calculates Cyclic Redundancy Check (CRC) codewords. The client takes a data word and divisor from the user and sends them to the server. The server calculates the CRC codeword and returns it back to the client.

## Overview

Cyclic Redundancy Check (CRC) is an error-detecting code commonly used in digital networks and storage devices to detect accidental changes to raw data. The calculation uses polynomial division, where the message is the dividend, the divisor is the generator polynomial, and the remainder becomes the CRC.

This implementation uses Unix file sockets for inter-process communication between the client and server processes.

## Features

- Client-server architecture using Unix domain sockets
- Binary data word and divisor input
- CRC calculation on the server side
- Returns both the codeword and remainder to the client
- Graceful termination with "end" command

## Requirements

- Unix-like operating system (Linux, macOS, etc.)
- GCC compiler
- Standard C libraries

## Compilation

Compile the server and client programs using GCC:

```bash
gcc -o server server.c -lm
gcc -o client client.c
```

Note: The server requires the math library (`-lm`) for the `ceil()` and `log2()` functions.

## Usage

1. Start the server in one terminal:

```bash
./server
```

2. Start the client in another terminal:

```bash
./client
```

3. In the client terminal, enter a binary data word and divisor when prompted.

4. The server will calculate the CRC and send back the codeword and remainder.

5. To terminate both programs, enter "end" as the data word in the client.

## Example

```
# Server Terminal
Server Running

Waiting..
Server received from client
Data word : 1010
Divisor : 1001
Remainder: 110
Codeword : 1010110
Sending back codeword : 1010110
Sending back remainder : 110

# Client Terminal
Client Running

Enter the data word : 1010
Enter the divisor : 1001
Sending data to the server
Waiting for the server
Received from the server (Codeword) : 1010110

Received from the server (Remainder) : 110
```

## Implementation Details

### Client (`client.c`)

The client program:
1. Creates a Unix domain socket
2. Connects to the server socket
3. Takes data word and divisor input from the user
4. Sends the data to the server
5. Receives the calculated codeword and remainder
6. Displays the results to the user

### Server (`server.c`)

The server program:
1. Creates a Unix domain socket
2. Binds to a socket path
3. Listens for client connections
4. Accepts client connections
5. Receives data word and divisor from the client
6. Calculates the CRC using binary polynomial division
7. Sends the codeword and remainder back to the client

### CRC Algorithm

The CRC calculation:
1. Converts binary strings to decimal for processing
2. Appends zeros to the data word (equal to divisor length - 1)
3. Performs binary polynomial division
4. Returns both the codeword (original data + remainder) and the remainder

## Socket Communication

The application uses Unix domain sockets (`AF_UNIX`) with stream type (`SOCK_STREAM`) for reliable, connection-oriented communication between processes on the same machine.

## Data Structure

The client and server exchange data using a simple message structure:

```c
struct message {
    char word[MAX];  // For data word (from client) or codeword (from server)
    char divisor[MAX];  // For divisor (from client) or remainder (from server)
};
```

## License

This project is provided as-is for educational purposes.