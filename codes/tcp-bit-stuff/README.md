# TCP Socket Bit Stuffing Implementation

This project implements a client-server application using TCP sockets to perform bit stuffing. The client takes a bit-stream from the user and sends it to the server. The server performs bit stuffing on the received bit-stream and sends it back to the client. The client then displays the bit-stuffed result.

## What is Bit Stuffing?

Bit stuffing is a process used in data communication to prevent patterns in the transmitted data from being interpreted as control signals. In this implementation, whenever five consecutive '1' bits are encountered, a '0' bit is inserted (stuffed) after them to break the pattern.

## Components

The project consists of three files:
- `custom.h`: Header file containing common definitions and the bit stuffing function
- `server.c`: Server implementation that performs bit stuffing
- `client.c`: Client implementation that sends bit-streams and displays results

## How to Compile

To compile the server and client programs, use the following commands:

```bash
gcc -o server server.c
gcc -o client client.c
```

## How to Run

1. First, start the server:
   ```bash
   ./server
   ```

2. Then, in another terminal, start the client:
   ```bash
   ./client
   ```

3. The client will prompt you to enter a bit-stream (a sequence of 0s and 1s).

4. The server will perform bit stuffing on the received bit-stream and send it back to the client.

5. The client will display the bit-stuffed result.

6. To exit, enter "end" as the bit-stream.

## Example Usage

```
Enter a BIT STREAM: 11111111
Client Sent 11111111 to the Server
Bit Stuffed Result RECEIVED from the Server: 111110111

Enter a BIT STREAM: 0101111110
Client Sent 0101111110 to the Server
Bit Stuffed Result RECEIVED from the Server: 01011111010

Enter a BIT STREAM: end
Client Terminated...
```

## Implementation Details

- The server listens on port 1234 by default.
- The client connects to the server on localhost (127.0.0.1) by default.
- The maximum length of the bit-stream is limited to 32 bits.
- The server performs bit stuffing by inserting a '0' bit after every five consecutive '1' bits.
