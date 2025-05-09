# Student Data Sorting with Message Queues

This project demonstrates the use of System V IPC message queues for inter-process communication and distributed sorting. It consists of three separate programs that work together to sort student data by different criteria.

## Problem Statement

Create a message queue. One process will take name and roll number of 'N' students and send those to message queue. Second process will read the names, sort those and send back to message queue; third process will do the same on roll numbers. Then first process will read the entire data and print.

## Overview

The system consists of three processes that communicate through a message queue:

1. **Process 1 (p1.c)**: Takes student data input, sends to other processes, and displays sorted results
2. **Process 2 (p2.c)**: Sorts student data by name
3. **Process 3 (p3.c)**: Sorts student data by roll number

## Components

### Header File (msgq.h)

The header file defines the message queue structure and constants used by all processes.

Key elements:

- `MAX_STUDENTS`: Maximum number of students (100)
- `NAME_SIZE`: Maximum size of student name (32 characters)
- `MQ_KEY`: IPC key for the message queue (1234)
- `Student`: Structure to store student data (name and roll number)
- `Message`: Structure for message queue communication (message type, student array, count)

### Main Process (p1.c)

This process:

1. Takes input for N students (name and roll number)
2. Sends the data to Process 2 for name sorting
3. Sends the data to Process 3 for roll number sorting
4. Receives and displays the sorted data from both processes
5. Cleans up the message queue

### Name Sorting Process (p2.c)

This process:

1. Receives student data from Process 1
2. Sorts the data by student name using qsort()
3. Sends the sorted data back to Process 1

### Roll Number Sorting Process (p3.c)

This process:

1. Receives student data from Process 1
2. Sorts the data by roll number using qsort()
3. Sends the sorted data back to Process 1

## How It Works

The system uses message types to route messages between processes:

- Message type 21: From Process 1 to Process 2 (unsorted data)
- Message type 31: From Process 1 to Process 3 (unsorted data)
- Message type 12: From Process 2 to Process 1 (name-sorted data)
- Message type 13: From Process 3 to Process 1 (roll-sorted data)

## Compilation and Execution

To compile the programs:

```bash
gcc -o p1 p1.c
gcc -o p2 p2.c
gcc -o p3 p3.c
```

To run the system, open three terminal windows and execute:

```bash
# Terminal 1
./p3

# Terminal 2
./p2

# Terminal 3
./p1
```

Enter the number of students and their information in the p1 terminal. The sorted results will be displayed after all processes complete.

## Implementation Details

- The system uses System V IPC message queues for communication
- Message types are used to route different messages between processes
- The qsort() function is used for sorting with custom comparator functions
- Process 1 is responsible for cleaning up the message queue when done