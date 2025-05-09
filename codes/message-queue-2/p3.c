#include "msgq.h"

int compare_roll(const void *a, const void *b) {
	return ((Student *)a)->roll - ((Student *)b)->roll;
}

int main() {
	int mqid = msgget(MQ_KEY, IPC_CREAT|0666);
	Message msg;

	msgrcv(mqid, (void *)&msg, sizeof(msg) - sizeof(long), 31, 0);
	printf("Received from P3: \n");
	for (int i = 0; i < msg.count; i++)
		printf("%d\n", msg.students[i].roll);

	qsort(msg.students, msg.count, sizeof(Student), compare_roll);
	
	printf("Students have been sorted according to their roll\n");
	msg.mtype=13;
	msgsnd(mqid, (void *)&msg, sizeof(msg) - sizeof(long), 0);
	printf("\nMsg sent to P1.\n");

	return 0;
}
