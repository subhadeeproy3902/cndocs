#include "msgq.h"

void receive_sorted_data(int mqid) {
	Message msg;

	
	msgrcv(mqid, &msg, sizeof(msg) - sizeof(long), 12, 0);
	printf("\nSorted by Name:\n");
	for (int i = 0; i < msg.count; i++)
		printf("%s\n", msg.students[i].name);

	msgrcv(mqid, &msg, sizeof(msg) - sizeof(long), 13, 0);
	printf("\nSorted by Roll Number:\n");
	for (int i = 0; i < msg.count; i++)
		printf("%d\n", msg.students[i].roll);
}

int main() {
	Message msg;
	int mqid = msgget(MQ_KEY, IPC_CREAT|0666);
	
	int n;
	printf("Enter number of students: ");
	scanf("%d", &n);
	printf("\n");

	Student students[n];
	for (int i = 0; i < n; i++) {
		printf("Enter roll and name separated by space: ");
		scanf("%d %[^\n]s", &students[i].roll, students[i].name);
	}	

	msg.mtype = 21;
	msg.count = n;
	memcpy(msg.students, students, n * sizeof(Student));
	msgsnd(mqid, &msg, sizeof(msg) - sizeof(long), 0);
	
	printf("\nMsg sent to P2.\n");
	
	msg.mtype = 31;
	msg.count = n;
	memcpy(msg.students, students, n * sizeof(Student));
	msgsnd(mqid, &msg, sizeof(msg) - sizeof(long), 0);	

	printf("Msg sent to P3.\n");
	
	receive_sorted_data(mqid);

	msgctl(mqid, IPC_RMID, NULL);

	return 0;
}

