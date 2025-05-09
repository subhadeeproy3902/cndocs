# Number Base Conversion with Message Queues

This project demonstrates the use of System V IPC message queues in Linux for inter-process communication. It consists of four separate programs that work together to convert decimal numbers to different bases and display them.

## Overview

The system takes a decimal number from the user, converts it to binary, octal, and hexadecimal representations, and then sends these values to a message queue. Three separate programs read from the message queue and display the converted values.

## Components

### Header File (`msgq.h`)

- Defines the message queue structure and constants
- Sets the message size limit and IPC key

### Main Program (`p1.c`)

- Takes decimal input from the user
- Converts the decimal number to binary, octal, and hexadecimal
- Sends each converted value to the message queue with different message types
- Terminates when the user enters -1

### Binary Display Program (`p2.c`)

- Reads messages of type 2 from the queue
- Displays the binary representation of the input number
- Terminates when it receives a "-1" message

### Octal Display Program (`p3.c`)

- Reads messages of type 3 from the queue
- Displays the octal representation of the input number
- Terminates when it receives a "-1" message

### Hexadecimal Display Program (`p4.c`)

- Reads messages of type 4 from the queue
- Displays the hexadecimal representation of the input number
- Terminates when it receives a "-1" message
- Cleans up the message queue when terminating

## How It Works

1. The main program (`p1.c`) creates a message queue or connects to an existing one
2. It takes decimal numbers as input from the user
3. For each input number, it:
   - Converts the number to binary, octal, and hexadecimal
   - Sends each converted value to the message queue with a unique message type
4. The three receiver programs (`p2.c`, `p3.c`, `p4.c`) each read messages of their specific type
5. Each receiver displays its respective number representation
6. When the user enters -1, the main program sends termination signals to all receivers
7. The last receiver (`p4.c`) cleans up the message queue

## Compilation and Execution

To compile the programs:

```bash
gcc -o p1 p1.c
gcc -o p2 p2.c
gcc -o p3 p3.c
gcc -o p4 p4.c
```

To run the system, open four terminal windows and execute:

```bash
# Terminal 1
./p2

# Terminal 2
./p3

# Terminal 3
./p4

# Terminal 4
./p1
```

Enter decimal numbers in the p1 terminal to see the converted values appear in the other terminals.

## Implementation Details

- The system uses System V IPC message queues for communication
- Message types are used to route different base conversions to the appropriate receiver
- The message structure contains a message type and a data field
- Custom conversion functions are implemented for binary, octal, and hexadecimal