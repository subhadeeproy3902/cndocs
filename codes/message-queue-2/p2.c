#include "msgq.h"

int compare_name(const void *a, const void *b) {
	return strcmp(((Student *)a)->name, ((Student *)b)->name);
}

int main() {
	int mqid = msgget(MQ_KEY, IPC_CREAT|0666);
	Message msg;

	msgrcv(mqid, (void *)&msg, sizeof(msg) - sizeof(long), 21, 0);
	printf("Received from P1: \n");
	for (int i = 0; i < msg.count; i++)
		printf("%s\n", msg.students[i].name);

	qsort(msg.students, msg.count, sizeof(Student), compare_name);
	printf("Students have been sorted according to their names\n");
	msg.mtype=12;
	msgsnd(mqid, (void *)&msg, sizeof(msg) - sizeof(long), 0);
	printf("\nMsg sent to P1.\n");
	
	return 0;
}
