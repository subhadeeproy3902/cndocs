#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/socket.h>

#define MAX 100

int main() {
	int sockfd, len, result;
	struct sockaddr_in address;
	char input[MAX], res[MAX];
	puts("Client is Running!!");
	
	sockfd = socket(AF_INET, SOCK_DGRAM, 0);
	address.sin_family = AF_INET;
	address.sin_addr.s_addr = inet_addr("127.0.0.1");
	address.sin_port = htons(8888);
	len=sizeof(address);
	
	strcpy(input, "Hello from Client..");
	printf("Sending %s to the server.\n",input);
	sendto(sockfd, input, strlen(input)+1, 0, (struct sockaddr*)&address, len);
	result = recvfrom(sockfd, res, MAX, 0, (struct sockaddr*)&address, &len);
	if(result == -1) {
		puts("Server not found!!");
		perror("recvfrom");
		exit(1);
	}
	else {
		printf("Server sent: %s\n",res);
		printf("Connected to Server..\n");
		strcpy(res, "");
		strcpy(input, "");
	}
	while(1) {
		printf("\nEnter the dataword: ");
		scanf("%[^\n]",input);
		getchar();
		printf("Sending message to the server\n");
		sendto(sockfd, input, strlen(input)+1, 0, (struct sockaddr*)&address, len);
		if(strcmp(input, "end")==0) {
			break;
		}
		printf("Waiting for the server..\n");
		sleep(1);
		recvfrom(sockfd, res, MAX, 0, (struct sockaddr*)&address, &len);
		printf("Client Received the codeword: ");
		for(int i = strlen(res); i >=0; i--) {
			printf("%c", res[i]);
		}
		printf("\n");
	}
	close(sockfd);
	return 0;
}