#include<stdio.h>
#include<stdlib.h>
#include <string.h>
#include<sys/types.h>
#include<sys/ipc.h>
#include<sys/msg.h>
#include "msgq.h"

int main() {
    int msgid = msgget(key, IPC_CREAT | 0666);
    MQ msg;
    while (1) {
        msgrcv(msgid, &msg, sizeof(msg.md), 2, 0);
        if (strcmp(msg.md, "-1") == 0) {
            printf("Process terminated\n");
            break;
        }
        printf("Binary: %s\n", msg.md);
    }

    return 0;
}

