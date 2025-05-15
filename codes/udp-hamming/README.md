# UDP Hamming Code Implementation

This project implements a client-server application using UDP sockets to perform Hamming code error correction. The client takes a data word from the user and sends it to the server. The server calculates the Hamming code for the data word and sends the codeword back to the client.

## What is Hamming Code?

Hamming code is an error-correction code that can detect and correct single-bit errors in data transmission. It works by adding parity bits at specific positions in the data word, allowing the receiver to detect and correct errors.

## Components

The project consists of two files:
- `server.c`: Server implementation that calculates Hamming codes
- `client.c`: Client implementation that sends data words and displays results

## How to Compile

To compile the server and client programs, use the following commands:

```bash
gcc -o server server.c -lm
gcc -o client client.c
```

Note: The `-lm` flag is required for the server to link the math library (for the `pow()` function).

## How to Run

1. First, start the server:
   ```bash
   ./server
   ```

2. Then, in another terminal, start the client:
   ```bash
   ./client
   ```

3. The client will prompt you to enter a data word (a sequence of 0s and 1s).

4. The server will calculate the Hamming code for the data word and send it back to the client.

5. The client will display the Hamming code.

6. To exit, enter "end" as the data word.

## Example Usage

```
Enter the dataword: 1011
Sending message to the server
Waiting for the server..
Client Received the codeword: 1001101

Enter the dataword: 101
Sending message to the server
Waiting for the server..
Client Received the codeword: 10101

Enter the dataword: end
```

## Implementation Details

- The server listens on port 8888 by default.
- The client connects to the server on localhost (127.0.0.1) by default.
- The server uses the Hamming code algorithm to add parity bits to the data word.
- The number of parity bits depends on the length of the data word.
- The client displays the Hamming code in reverse order to match the conventional representation.

## Hamming Code Algorithm

The Hamming code algorithm used in this implementation follows these steps:

1. Calculate the number of parity bits needed (r) using the formula: 2^r ≥ m + r + 1, where m is the length of the data word.
2. Position the parity bits at positions that are powers of 2 (1, 2, 4, 8, etc.).
3. Fill in the data bits at the remaining positions.
4. Calculate each parity bit by XORing the bits in positions that have the corresponding bit set in their binary representation.
5. Combine the data and parity bits to form the complete Hamming code.

This implementation ensures that single-bit errors can be detected and corrected.