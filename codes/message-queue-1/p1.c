#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<sys/ipc.h>
#include<sys/msg.h>
#include<string.h>
#include<unistd.h>
#include "msgq.h"

void toBinary(int num, char *bin) {
    int i = 0;
    for (int bit = 31; bit >= 0; bit--) {
        bin[i++] = ((num >> bit) & 1) ? '1' : '0';
    }
    bin[i] = '\0';
}

void toOctal(int num, char *oct) {
    int i = 0;
    for (int shift = 30; shift >= 0; shift -= 3) {
        int digit = (num >> shift) & 7;
        if (i || digit) {
            oct[i++] = digit + '0';
        }
    }
    if (i == 0) oct[i++] = '0';
    oct[i] = '\0';
}

void toHex(int num, char *hex) {
    int i = 0;
    for (int shift = 28; shift >= 0; shift -= 4) {
        int digit = (num >> shift) & 15;
        if (i || digit) {
            hex[i++] = digit < 10 ? (digit + '0') : (digit - 10 + 'A');
        }
    }
    if (i == 0) hex[i++] = '0';
    hex[i] = '\0';
}

int main() {
    int msgid = msgget(key, IPC_CREAT | 0666);
    MQ msg;
    char binary[N], octal[N], hex[N];
    int num;

    while (1) {
        printf("Enter a decimal number (-1 to exit): ");
        scanf("%d", &num);

        if (num == -1) {
            msg.mt = 2;
            strcpy(msg.md, "-1");
            msgsnd(msgid, &msg, sizeof(msg.md), 0);

            msg.mt = 3;
            strcpy(msg.md, "-1");
            msgsnd(msgid, &msg, sizeof(msg.md), 0);

            msg.mt = 4;
            strcpy(msg.md, "-1");
            msgsnd(msgid, &msg, sizeof(msg.md), 0);

            printf("Process terminated\n");
            break;
        }

        toBinary(num, binary);
        toOctal(num, octal);
        toHex(num, hex);

        msg.mt = 2;
        strcpy(msg.md, binary);
        msgsnd(msgid, &msg, sizeof(msg.md), 0);

        msg.mt = 3;
        strcpy(msg.md, octal);
        msgsnd(msgid, &msg, sizeof(msg.md), 0);

        msg.mt = 4;
        strcpy(msg.md, hex);
        msgsnd(msgid, &msg, sizeof(msg.md), 0);
    }
    return 0;
}
