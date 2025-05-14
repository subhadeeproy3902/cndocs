#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <pthread.h>
#include <netinet/in.h>
#include <sys/types.h>
#include <sys/socket.h>

#define PORT_NO 8888
#define MAX 100
#define ip "127.0.0.1"