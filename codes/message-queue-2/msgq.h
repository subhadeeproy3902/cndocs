#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include <unistd.h>

#define MAX_STUDENTS 100
#define NAME_SIZE 32
#define MQ_KEY 1234

typedef struct {
	char name[NAME_SIZE];
	int roll;
} Student;

typedef struct {
	long mtype;
	Student students[MAX_STUDENTS];
	int count;
} Message;
